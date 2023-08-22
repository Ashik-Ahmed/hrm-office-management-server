const { ObjectId } = require("mongodb");
const Employee = require("../models/Employee");
const Leave = require("../models/Leave");

//create a new user
exports.createEmployeeService = async (employeeInfo) => {
    // console.log(employeeInfo);

    const employee = await Employee.create(employeeInfo);
    return employee;
}

//find a employee by Id
exports.findEmployeeByIdService = async (id) => {

    // const employee = await Employee.findOne({ _id: id });

    const employee = await Employee.aggregate([
        {
            $match: { _id: new ObjectId(id) }
        },
        {
            $project: { password: 0 }
        }
    ])

    return employee[0];
}

// find a user by email 
exports.findEmployeeByEmailService = async (email) => {

    const employee = await Employee.findOne({ email })
    // const employee = await Employee.aggregate([
    //     {
    //         $match: { email: email }
    //     },
    //     {
    //         $project: {
    //             email: 1,
    //             password: 1,
    //             // name: firstName + lastName,
    //             firstName: 1,
    //             lastName: 1,
    //             userRole: 1,
    //         }
    //     }
    // ])
    return employee;
}

//find all users
exports.getAllEmployeeService = async () => {
    const employee = await Employee.aggregate([
        {
            $project: {
                email: 1,
                firstName: 1,
                lastName: 1,
                userRole: 1,
                designation: 1,
                photo: 1,
                joiningDate: 1,
            }
        }
    ])
    return employee;
}

//delete a user by id
exports.deleteEmployeeByIdService = async (id) => {
    const result = await Employee.deleteOne({ _id: id });
    return result;
}

exports.getleaveHistoryByEmployeeIdService = async (id) => {
    const leaveHistoryFromDB = await Employee.findOne({ _id: id })
        .select({ leaveHistory: 1, _id: 0 }) //only get leaveHistory field from Employee Model
        .populate({
            path: "leaveHistory",
            select: "-employee" //exclode the employee field from leaveHistory
        })
    const { leaveHistory } = leaveHistoryFromDB;

    return leaveHistory.reverse();
}

exports.getLeaveStatusByEmployeeIdService = async (id) => {
    console.log(id);

    const leaveStatus = await Employee.aggregate([
        {
            $match: { _id: new ObjectId(id) }
        },
        {
            $lookup: {
                from: 'leaveapplications', // The name of the collection
                localField: 'leaveHistory',
                foreignField: '_id',
                as: 'leaveApplicationsDetails',
            },
        },
        {
            $unwind: { path: '$leaveApplicationsDetails', preserveNullAndEmptyArrays: true }
        },
        {
            $group: {
                _id: '$leaveApplicationsDetails.leaveType',
                availed: { $sum: { $ifNull: ['$leaveApplicationsDetails.totalDay', 0] } },
            },
        },
        {
            $lookup: {
                from: 'leaves', // The name of the collection
                localField: '_id',
                foreignField: 'leaveType',
                as: 'leaveDetails',
            },
        },
        {
            $project: {
                _id: 1,
                availed: 1,
                total: { $arrayElemAt: ['$leaveDetails.total', 0] },
            },
        },
    ])


    console.log(leaveStatus);

    // Create a Map to store the aggregation result
    const resultMap = new Map();

    // Update resultMap with the aggregation result
    leaveStatus.forEach(entry => {
        resultMap.set(entry._id, { availed: entry.availed, total: entry.total });
    });

    // Fetch all unique leaveType values from the Leaves collection
    const allLeaveTypes = await Leave.distinct('leaveType');

    // For leave types not present in the result, set availed value to 0
    allLeaveTypes.forEach(leaveType => {
        if (!resultMap.has(leaveType)) {
            resultMap.set(leaveType, { availed: 0, total: 0 });
        }
    });

    // Convert resultMap to an array of objects
    const finalResult = Array.from(resultMap, ([leaveType, values]) => ({
        leaveType,
        availed: values.availed,
        total: values.total,
    }));

    console.log(finalResult);

    return leaveStatus;

}