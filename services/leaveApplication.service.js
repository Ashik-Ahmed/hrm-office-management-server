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

exports.updateLeaveApplicationStatusService = async ({ id, data }) => {
    const updateStatus = await LeaveApplication.updateOne(
        { _id: id },
        { $set: { currentStatus: data } }
    )

    console.log("from service : ", updateStatus);

    return updateStatus;
}