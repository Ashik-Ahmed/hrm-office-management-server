const { ObjectId } = require("mongodb");
const LeaveApplication = require("../models/LeaveApplication");
const { default: mongoose } = require("mongoose");



exports.leaveApplicationService = async (leaveApplicationData) => {
    // console.log(leaveApplicationData);

    const leaveApplication = await LeaveApplication.create(leaveApplicationData)
    return leaveApplication;
}

exports.getLeaveApplicationsByIdService = async (employeeId) => {

    const leaveApplications = await LeaveApplication.aggregate([
        {
            $match: { employeeId: new ObjectId(employeeId) }
        }
    ])
    console.log("leaveApplications", leaveApplications);
    return leaveApplications.reverse();
}