const Conveyance = require("../models/Conveyance");
const Employee = require("../models/Employee");

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
        },
        {
            $addFields: {
                totalConveyances: { $size: '$conveyanceDetails' },
                pendingConveyances: {
                    $size: {
                        $filter: {
                            input: '$conveyanceDetails',
                            cond: { $eq: ['$$this.paymentStatus', 'Pending'] }
                        }
                    }
                }
            }
        }
    ])
    // console.log(conveyance[0].conveyanceDetails);
    return conveyance[0];
}

exports.getAllEmployeeMonthlyConveyanceService = async (query) => {
    console.log("Monthly Conveyance");
    const month = parseInt(query.month || (new Date().getMonth() + 1))
    const year = parseInt(query.year || new Date().getFullYear())

    const allConveyances = await Conveyance.aggregate([
        {
            $match: {
                $expr: {
                    $and: [
                        { $eq: [{ $month: '$date' }, month] },
                        { $eq: [{ $year: '$date' }, year] },
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