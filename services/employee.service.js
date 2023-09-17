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

    const employee = await Employee.findOne({ email }, { firstName: 1, lastName: 1, designation: 1, image: 1, email: 1, password: 1 })
    // const employee = await Employee.aggregate([
    //     {
    //         $match: { email: email }
    //     },
    //     {
    //         $project: {
    //             email: 1,
    //             password: 1,
    //             // name: firstName + lastName,
    //             // firstName: 1,
    //             // lastName: 1,
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
                image: 1,
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
                            { 'leaveApplicationsDetails.currentStatus.status': 'Approved by Technical' }
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

    // console.log(leaveStatus);

    // If result contains { _id: null, availed: 0 }, that means Emplpoyee doesn't have the property "leaveHistory", then set finalResult to an empty array
    const leaveStatusUpdated = leaveStatus.some(entry => entry._id === null && entry.availed === 0)
        ? []
        : leaveStatus.map(entry => ({
            leaveType: entry._id,
            availed: entry.availed,
            total: entry.total,
        }));

    // console.log("leaveStatus:", leaveStatus);

    // Create a Map to store the aggregation result
    const resultMap = new Map();

    // Update resultMap with the aggregation result
    leaveStatus.forEach(entry => {
        resultMap.set(entry._id, { availed: entry.availed, total: entry.total });
    });
    // console.log("First result map:", resultMap);
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

    // console.log("aggregation:", allLeaveTypes);

    // For leave types not present in the result, set availed value to 0
    allLeaveTypes.forEach(leave => {
        if (!resultMap.has(leave.leaveType)) {
            resultMap.set(leave.leaveType, { availed: 0, total: leave.total });
        }
    });

    // console.log("foreach resultMap:", resultMap);

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
    // console.log("final:", finalResult);

    return finalResult;

}