const { ObjectId } = require("mongodb");
const Employee = require("../models/Employee");
const Leave = require("../models/Leave");
const Requisition = require("../models/Requisition");
const { default: mongoose } = require("mongoose");
const bcrypt = require('bcryptjs');
const Role = require("../models/Role");

//create a new user
exports.createEmployeeService = async (employeeInfo) => {


    const employee = await Employee.create(employeeInfo);

    if (employee?._id) {
        // Push the employee to the role
        const pushUserRole = await Role.updateOne({ _id: employeeInfo.userRole }, { $push: { users: employee._id } });
    }

    return employee;
}

exports.loginByEmailService = async (email) => {
    const employee = await Employee.findOne({ email }, { firstName: 1, lastName: 1, designation: 1, department: 1, userRole: 1, image: 1, email: 1, password: 1 }).populate({
        path: 'userRole',
        select: 'roleName pageAccess -_id',
        model: 'Role',
        populate: {
            path: 'pageAccess',
            select: 'title url -_id',
            model: 'Page',
            options: {
                sort: { serial: 1 }
            }
        }
    })

    return employee;
}

//find a employee by Id
exports.findEmployeeByIdService = async (id) => {

    const employee = await Employee.aggregate([
        {
            $match: { _id: new ObjectId(id) }
        },
        {
            $lookup: {
                from: "roles", // Collection name of the Role model in MongoDB
                localField: "userRole",
                foreignField: "_id",
                as: "roleDetails"
            }
        },
        {
            $unwind: "$roleDetails"
        },
        {
            $addFields: {
                userRole: "$roleDetails.roleName" // Add userRole field with roleName
            }
        },
        {
            $project: { password: 0, leaveHistory: 0, conveyance: 0, roleDetails: 0 }
        }
    ])

    return employee[0];
}

// find a user by email 
exports.findEmployeeByEmailService = async (email) => {

    const employee = await Employee.findOne({ email }, { firstName: 1, lastName: 1, designation: 1, department: 1, userRole: 1, image: 1, email: 1, password: 1 }).populate({
        path: 'userRole',
        select: 'roleName',
        model: 'Role'
    })

    return employee;
    // const employee = await Employee.aggregate([
    //     {
    //         $match: { email }
    //     },
    //     {
    //         $lookup: {
    //             from: "roles",
    //             localField: "userRole",
    //             foreignField: "_id",
    //             as: "roleDetails"
    //         }
    //     },
    //     {
    //         $unwind: "$roleDetails"
    //     },
    //     {
    //         $addFields: {
    //             userRole: "$roleDetails.roleName" // Add userRole field with roleName
    //         }
    //     },
    //     {
    //         $project: { employeeId: 0, leaveHistory: 0, conveyance: 0, roleDetails: 0, bio: 0, mobile: 0, joiningDate: 0, passwordResetToken: 0, passwordResetTokenExpires: 0, updatedAt: 0 }
    //     }
    // ])

    // return employee[0];
}

exports.findEmployeeByTokenService = async (token) => {
    const employee = await Employee.findOne({ passwordResetToken: token }, { passwordResetToken: 1, passwordResetTokenExpires: 1, email: 1 })
    return employee;
}

exports.updatePasswordByTokenService = async (token, newPassword) => {
    const hashedPassword = bcrypt.hashSync(newPassword);
    const employee = await Employee.updateOne({ passwordResetToken: token }, { passwordResetToken: null, passwordResetTokenExpires: null, password: hashedPassword })
    return employee;
}

//find all users
exports.getAllEmployeeService = async (query) => {
    const matchCondition = {};
    if (query?.department !== "All") {
        matchCondition.department = query.department;
    }

    const employee = await Employee.aggregate([
        {
            $match: matchCondition
        },
        {
            $lookup: {
                from: "roles", // Collection name of the Role model in MongoDB
                localField: "userRole",
                foreignField: "_id",
                as: "roleDetails"
            }
        },
        {
            $unwind: "$roleDetails"
        },
        {
            $project: {
                employeeId: 1,
                email: 1,
                mobile: 1,
                firstName: 1,
                lastName: 1,
                department: 1,
                userRole: "$roleDetails.roleName",
                designation: 1,
                image: 1,
                joiningDate: 1,
            }
        }
    ])
    return employee;
}

//update employee profile
exports.updateEmployeeByIdService = async (empId, data) => {

    if (data?.userRole) {
        const currentRole = await Role.findOne({ users: empId });
        // Pull the employee from the old role
        const pullUserRole = await Role.updateOne({ _id: currentRole?._id }, { $pull: { users: empId } });

        // Push the employee to the new role
        const pushUserRole = await Role.updateOne({ _id: data.userRole }, { $push: { users: empId } });
    }


    const result = await Employee.updateOne({ _id: empId }, data)

    return result;
}

// get employees by department name 
exports.getEmployeeByDepartmentService = async (department) => {
    const employees = await Employee.aggregate([
        {
            $match: { department: department }
        },
        {
            $project: {
                name: { $concat: ["$firstName", " ", "$lastName"] }
            }
        }
    ])
    return employees
}

//update user password
exports.updateEmployeePasswordByEmailService = async (email, newPassword) => {
    const hashedPassword = bcrypt.hashSync(newPassword);

    const result = await Employee.updateOne({ email }, { $set: { password: hashedPassword } })

    return result;


}

//delete a user by id
exports.deleteEmployeeByIdService = async (id) => {
    const result = await Employee.deleteOne({ _id: id });
    return result;
}

exports.getleaveHistoryByEmployeeIdService = async (id, query) => {
    const { year } = query;

    const leaveHistoryFromDB = await Employee.findOne({
        _id: id,
    })
        .select({ leaveHistory: 1, _id: 0 }) //only get leaveHistory field from Employee Model
        .populate({
            path: "leaveHistory",
            match: {
                $expr: {
                    $eq: [{ $year: "$toDate" }, year]
                }
            },
            select: "-employee", //exclude the employee field from leaveHistory
        })

    // const leaveHistoryFromDB = await Employee.aggregate([
    //     { $match: { _id: new mongoose.Types.ObjectId(id) } },
    //     {
    //         $lookup: {
    //             from: 'leaveApplications',
    //             localField: 'leaveHistory',
    //             foreignField: '_id',
    //             as: 'leaveApplicationsData'
    //         }
    //     },
    //     {
    //         $unwind: '$leaveApplicationsData'
    //     },
    //     {
    //         $match: {
    //             $expr: {
    //                 $eq: [{ $year: '$leaveApplicationsData.toDate' }, 2023]
    //             }
    //         }
    //     },
    //     {
    //         $project: {
    //             _id: '$leaveApplicationsData._id',
    //             fromDate: '$leaveApplicationsData.fromDate',
    //             toDate: '$leaveApplicationsData.toDate',
    //             totalDay: '$leaveApplicationsData.totalDay',
    //             // Add other fields as needed
    //         }
    //     }
    // ]);


    const { leaveHistory } = leaveHistoryFromDB;

    return leaveHistory.reverse();
}

exports.getLeaveStatusByEmployeeIdService = async (id, year) => {

    const filteredYear = parseInt(year) || new Date().getFullYear();

    const leaveStatus = await Employee.aggregate([
        {
            $match: {
                _id: new ObjectId(id)
            }
        },
        {
            $lookup: {
                from: 'leaveapplications',
                localField: 'leaveHistory',
                foreignField: '_id',
                as: 'leaveApplicationsDetails'
            }
        },
        {
            $unwind: { path: '$leaveApplicationsDetails', preserveNullAndEmptyArrays: true }
        },
        {
            $match: {
                $and: [
                    {
                        $or: [
                            { 'leaveApplicationsDetails.currentStatus.status': 'Pending' },
                            { 'leaveApplicationsDetails.currentStatus.status': 'Approved' }
                        ]
                    },
                    {
                        $expr: {
                            $eq: [{ $year: '$leaveApplicationsDetails.toDate' }, filteredYear] // Match documents toDate in 2023
                        }
                    }
                ]
            }
        },
        {
            $group: {
                _id: '$leaveApplicationsDetails.leaveType',
                availed: { $sum: { $ifNull: ['$leaveApplicationsDetails.totalDay', 0] } }
            }
        },
        {
            $lookup: {
                from: 'leaves',
                localField: '_id',
                foreignField: 'leaveType',
                as: 'leaveDetails'
            }
        },
        {
            $project: {
                _id: 1,
                availed: 1,
                total: { $arrayElemAt: ['$leaveDetails.total', 0] }
            }
        }
    ]);



    // If result contains { _id: null, availed: 0 }, that means Emplpoyee doesn't have the property "leaveHistory", then set finalResult to an empty array
    const leaveStatusUpdated = leaveStatus.some(entry => entry._id === null && entry.availed === 0)
        ? []
        : leaveStatus.map(entry => ({
            leaveType: entry._id,
            availed: entry.availed,
            total: entry.total,
        }));



    // Create a Map to store the aggregation result
    const resultMap = new Map();

    // Update resultMap with the aggregation result
    leaveStatus.forEach(entry => {
        resultMap.set(entry._id, { availed: entry.availed, total: entry.total });
    });

    // Fetch all unique leaveType values from the Leaves collection
    const allLeaveTypes = await Leave.aggregate([
        {
            $project: {
                leaveType: 1,
                total: 1,
                _id: 0
            }
        }
    ]);



    // For leave types not present in the result, set availed value to 0
    allLeaveTypes.forEach(leave => {
        if (!resultMap.has(leave.leaveType)) {
            resultMap.set(leave.leaveType, { availed: 0, total: leave.total });
        }
    });



    // Convert resultMap to an array of objects
    const finalResult = Array.from(resultMap, ([leaveType, values]) => ({
        leaveType,
        availed: values.availed,
        total: values.total,
    }));

    finalResult.map(entry => {
        entry.balance = entry.total - entry.availed
    })

    // Sort the final result by leaveType
    finalResult.sort((a, b) => a.leaveType.localeCompare(b.leaveType));


    return finalResult;

}


exports.getAllRequisitionByEmployeeIdService = async (employeeId, query) => {

    const month = parseInt(query.month || (new Date().getMonth() + 1))
    const year = parseInt(query.year || new Date().getFullYear())

    const allRequisition = await Requisition.aggregate([
        {
            $match: {
                submittedBy: new mongoose.Types.ObjectId(employeeId),
                createdAt: {
                    $gte: new Date(year, month - 1, 1), // Start of the month
                    $lt: new Date(year, month, 1), // Start of the next month
                },
            }
        },
        {
            $project: {
                department: 1,
                status: 1,
                createdAt: 1,
                // createdAt: {
                //     $dateToString: {
                //         // format: "%Y-%m-%d", // Format as YYYY-MM-DD
                //         format: "%d-%m-%Y",
                //         date: "$createdAt",
                //         // timezone: "UTC" // Assuming your dates are in UTC
                //     }
                // },
                totalProposedItems: {
                    $sum: "$itemList.proposedQuantity"
                },
                totalApprovedItems: {
                    $sum: "$itemList.approvedQuantity"
                },
                proposedAmount: {
                    $sum: {
                        $map: {
                            input: "$itemList",
                            as: "item",
                            in: { $multiply: ["$$item.proposedQuantity", "$$item.unitPrice"] }
                        }
                    }
                },
                finalAmount: {
                    $sum: {
                        $map: {
                            input: "$itemList",
                            as: "item",
                            in: { $multiply: ["$$item.approvedQuantity", "$$item.unitPrice"] }
                        }
                    }
                }
            }
        }
    ])


    return allRequisition;
}