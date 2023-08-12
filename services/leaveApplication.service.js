const { ObjectId } = require("mongodb");
const LeaveApplication = require("../models/LeaveApplication");
const { default: mongoose } = require("mongoose");
const Employee = require("../models/Employee");



exports.leaveApplicationService = async (leaveApplicationData) => {
    // console.log(leaveApplicationData);

    const leaveApplication = await LeaveApplication.create(leaveApplicationData)

    const { _id: leaveApplicationId, employee } = leaveApplication;

    const res = await Employee.updateOne(
        { _id: employee.id },
        { $push: { leaveHistory: leaveApplicationId } }
    );

    console.log(res);

    return leaveApplication;
}

exports.getLeaveApplicationsByIdService = async (employeeId) => {

    const leaveApplications = await LeaveApplication.aggregate([
        {
            $match: { 'employee.employeeId': new ObjectId(employeeId) }
        }
    ])
    return leaveApplications.reverse();
}

exports.getPendingLeaveApplications = async () => {
    const pendingLeaveApplications = await LeaveApplication.aggregate([
        {
            $match: {
                currentStatus: { $ne: "Approved" }
            }
        }
    ])

    return pendingLeaveApplications.reverse();
}