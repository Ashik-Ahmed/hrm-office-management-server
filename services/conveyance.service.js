const Conveyance = require("../models/Conveyance");
const Employee = require("../models/Employee");

exports.createConveyanceService = async (conveyanceData) => {
    // console.log(conveyanceData);

    const result = await Conveyance.create(conveyanceData);

    if (result._id) {

        const { _id: conveyanceId, employee } = result;

        // update Employee profile with conveyyance id 
        const res = await Employee.updateOne(
            { _id: employee.employeeId },
            { $push: { conveyance: conveyanceId } }
        )
        if (res.modifiedCount > 0) {
            return result;
        }
        else {
            // delete the conveyance if not modified in the employee profile 
            const deleteConveyance = await Conveyance.deleteOne({ _id: conveyanceId })
            return "Insert failed. Try again."
        }
    }
    else {
        return "Error Occurred"
    }
}

exports.getConveyanceByEmployeeEmailService = async (employeeEmail, query) => {

    const month = parseInt(query.month || (new Date().getMonth() + 1))
    const year = parseInt(query.year || new Date().getFullYear())
    // console.log(month, year);

    const conveyance = await Employee.aggregate([
        {
            $match: { email: employeeEmail }
        },
        {
            $lookup: {
                from: 'conveyances',
                localField: 'conveyance',
                foreignField: '_id',
                as: 'conveyanceDetails'
            }
        },
        {
            $addFields: {
                conveyanceDetails: {
                    $filter: {
                        input: '$conveyanceDetails',
                        cond: {
                            $and: [
                                { $eq: [{ $year: '$$this.date' }, year] },
                                { $eq: [{ $month: '$$this.date' }, month] }
                            ]
                        }
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                conveyanceDetails: 1
            }
        },
        {
            $addFields: {
                totalAmount: {
                    $reduce: {
                        input: '$conveyanceDetails',
                        initialValue: 0,
                        in: { $add: ['$$value', '$$this.amount'] }
                    }
                }
            }
        },
        {
            $addFields: {
                totalDueAmount: {
                    $reduce: {
                        input: {
                            $filter: {
                                input: '$conveyanceDetails',
                                as: 'conveyance',
                                cond: { $eq: ['$$conveyance.paymentStatus', 'Pending'] }
                            }
                        },
                        initialValue: 0,
                        in: { $add: ['$$value', '$$this.amount'] }
                    }
                }
            }
        }
    ])
    // console.log(conveyance[0].conveyanceDetails);
    return conveyance;
}