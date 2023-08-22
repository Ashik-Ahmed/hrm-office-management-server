const { ObjectId } = require("mongodb");
const Leave = require("../models/Leave")

exports.createLeaveService = async (leaveInfo) => {
    const leave = await Leave.create(leaveInfo)

    return leave;
}

exports.getAllLeaveService = async () => {
    const leaves = await Leave.aggregate([
        {
            $project: {
                leaveType: 1,
                total: 1,
                description: 1
            }
        }
    ]);

    return leaves;
}


exports.updateLeaveByIdService = async (leaveId, updatedData) => {
    // console.log(leaveId, updatedData);
    const updateStatus = await Leave.updateOne(
        { _id: leaveId },
        { $set: updatedData }
    )

    return updateStatus;
}

exports.deleteLeaveByIdServie = async (leaveId) => {

    const deleteStatus = await Leave.deleteOne({ _id: leaveId })
    console.log(deleteStatus);

    return deleteStatus;
}