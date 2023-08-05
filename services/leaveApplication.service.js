const LeaveApplication = require("../models/LeaveApplication");



exports.leaveApplicationService = async (leaveApplicationData) => {
    // console.log(leaveApplicationData);

    const leaveApplication = await LeaveApplication.create(leaveApplicationData)
    console.log(leaveApplication);
    return leaveApplication;
}