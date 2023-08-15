const { ObjectId } = require("mongodb");
const LeaveApplication = require("../models/LeaveApplication");
const { default: mongoose } = require("mongoose");
const Employee = require("../models/Employee");



exports.leaveApplicationService = async (leaveApplicationData) => {
    // console.log(leaveApplicationData);

    const leaveApplication = await LeaveApplication.create(leaveApplicationData)

    const { _id: leaveApplicationId, employee } = leaveApplication;

    const res = await Employee.updateOne(
        { _id: employee.employeeId },
        { $push: { leaveHistory: leaveApplicationId } }
    );


    return leaveApplication;
}

exports.getLeaveApplicationsByEmployeeIdService = async (employeeId) => {

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

exports.updateLeaveApplicationStatusService = async ({ employeeId, data }) => {
    console.log("from service:", employeeId, data);
    const updateStatus = await LeaveApplication.aggregate([
        {
            $match: { _id: employeeId }
        }
    ])

    return updateStatus;
}