const { ObjectId } = require("mongodb");
const LeaveApplication = require("../models/LeaveApplication");
const { default: mongoose } = require("mongoose");
const Employee = require("../models/Employee");



exports.leaveApplicationService = async (leaveApplicationData) => {
    console.log(leaveApplicationData);

    const leaveApplication = await LeaveApplication.create(leaveApplicationData)

    const { _id: leaveApplicationId, employee } = leaveApplication;

    const res = await Employee.updateOne(
        { _id: employee.employeeId },
        { $push: { leaveHistory: leaveApplicationId } }
    );

    return leaveApplication;
}

exports.getAllLeaveApplicationsService = async (query) => {
    let { year } = query;
    console.log(year);
    year = parseInt(year, 10); // Convert year to a number if it's a string
    const leaveApplications = await LeaveApplication.aggregate([
        {
            $match: {
                $expr: {
                    $eq: [{ $year: "$createdAt" }, year]
                }
            }
        }
    ])
    console.log(leaveApplications);
    return leaveApplications.reverse();
}

exports.updateLeaveApplicationStatusService = async ({ id, data }) => {

    const updateStatus = await LeaveApplication.updateOne(
        { _id: id },
        { $set: { currentStatus: data } }
    )

    console.log("from service : ", updateStatus);

    return updateStatus;
}