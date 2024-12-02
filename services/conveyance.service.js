const { ObjectId } = require("mongodb");
const Conveyance = require("../models/Conveyance");
const Employee = require("../models/Employee");
const { default: mongoose } = require("mongoose");

exports.createConveyanceService = async (conveyanceData) => {
    console.log(conveyanceData);

    const result = await Conveyance.create(conveyanceData);

    if (result._id) {

        const { _id: conveyanceId, employee } = result;

        // update Employee profile with conveyyance id 
        const res = await Employee.updateOne(
            { email: employee.email },
            { $push: { conveyance: conveyanceId } }
        );
        console.log(result);
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

exports.deleteConveyanceByIdServicce = async (conveyanceId) => {

    const result = await Conveyance.deleteOne({ _id: conveyanceId })

    console.log(result);

    return result

}
exports.getConveyanceByEmployeeEmailService = async (employeeEmail, query) => {

    const month = parseInt(query.month || (new Date().getMonth() + 1));
    const year = parseInt(query.year || new Date().getFullYear());

    const offset = 6; // example offset in hours

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
                            // $and: [
                            //     { $eq: [{ $year: '$$this.date' }, year] },
                            //     { $eq: [{ $month: '$$this.date' }, month] }
                            // ]
                            $and: [
                                { $eq: [{ $year: { $add: ['$$this.date', offset * 60 * 60 * 1000] } }, year] },
                                { $eq: [{ $month: { $add: ['$$this.date', offset * 60 * 60 * 1000] } }, month] }
                            ]
                        }
                    }
                }
            }
        },
        {
            $unwind: '$conveyanceDetails' // Unwind the array to treat each conveyance as a separate document
        },
        {
            $sort: { 'conveyanceDetails.date': 1, 'conveyanceDetails.createdAt': 1 } // Sort by date and then by createdAt
        },
        {
            $group: {
                _id: '$_id', // Group by employee (you can change this if needed)
                conveyanceDetails: { $push: '$conveyanceDetails' }, // Push sorted conveyances back into an array
                totalAmount: { $sum: '$conveyanceDetails.amount' },
                totalDueAmount: {
                    $sum: {
                        $cond: [{ $eq: ['$conveyanceDetails.paymentStatus', 'Pending'] }, '$conveyanceDetails.amount', 0]
                    }
                },
                totalConveyances: { $sum: 1 },
                pendingConveyances: {
                    $sum: {
                        $cond: [{ $eq: ['$conveyanceDetails.paymentStatus', 'Pending'] }, 1, 0]
                    }
                }
            }
        },
        {
            $project: {
                _id: 1,
                conveyanceDetails: 1,
                totalAmount: 1,
                totalDueAmount: 1,
                totalConveyances: 1,
                pendingConveyances: 1
            }
        },
        // {
        //     $sort: {
        //         'conveyanceDetails.date': 1,
        //         'conveyanceDetails.createdAt': 1
        //     }
        // }
    ]);

    return conveyance[0];
}

exports.getAllEmployeeMonthlyConveyanceService = async (query) => {
    // console.log("Monthly Conveyance");
    const month = parseInt(query.month || (new Date().getMonth() + 1))
    const year = parseInt(query.year || new Date().getFullYear())

    const allConveyances = await Conveyance.aggregate([
        {
            $match: {
                $expr: {
                    $and: [
                        // { $eq: [{ $month: '$date' }, month] },
                        // { $eq: [{ $year: '$date' }, year] },
                        { $eq: [{ $year: { $add: ['$date', 6 * 60 * 60 * 1000] } }, year] },
                        { $eq: [{ $month: { $add: ['$date', 6 * 60 * 60 * 1000] } }, month] }
                    ]
                }
            }
        },
        {
            $group: {
                _id: '$employee',
                pendingAmount: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'Pending'] }, '$amount', 0] } },
                totalAmount: { $sum: '$amount' },
                totalConveyances: { $sum: 1 }, // Count total conveyances
                pendingConveyances: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'Pending'] }, 1, 0] } }, // Count pending conveyances
            }
        },
        {
            $lookup: {
                from: 'employees',
                localField: '_id',
                foreignField: 'conveyance',
                as: 'employeeDetails'
            }
        },
        {
            $project: {
                _id: 0,
                employee: {
                    name: '$_id.name',
                    email: '$_id.email',
                    totalAmount: '$totalAmount',
                    pendingAmount: '$pendingAmount',
                    totalConveyances: '$totalConveyances', // Include total conveyances count
                    pendingConveyances: '$pendingConveyances', // Include pending conveyances count
                }
            }
        },
        {
            $group: {
                _id: null,
                allEmployeePendingAmount: { $sum: '$employee.pendingAmount' },
                allEmployeeTotalAmount: { $sum: '$employee.totalAmount' },
                allEmployeeTotalConveyances: { $sum: '$employee.totalConveyances' },
                allEmployeePendingConveyances: { $sum: '$employee.pendingConveyances' },
                employeeData: { $push: '$employee' }
            }
        },
        {
            $project: {
                _id: 0,
                allEmployeeTotalConveyances: 1,
                allEmployeeTotalAmount: 1,
                allEmployeePendingConveyances: 1,
                allEmployeePendingAmount: 1,
                employeeData: 1
            }
        }
    ]);


    return allConveyances[0];
}


exports.makePaymentConveyanceBillService = async (pendingIds) => {
    console.log(pendingIds);
    const result = await Conveyance.updateMany(
        {
            _id: { $in: pendingIds.map(id => new mongoose.Types.ObjectId(id)) } // Correct usage of mongoose.Types.ObjectId
        },
        {
            $set: {
                paymentStatus: 'Paid'
            }
        }
    )

    console.log(result);
    return result;
}


exports.editConveyanceByIdService = async (id, updatedData) => {
    console.log(id);
    console.log(updatedData);

    const result = await Conveyance.updateOne({ _id: id }, updatedData)

    console.log(result);
    return result;
}