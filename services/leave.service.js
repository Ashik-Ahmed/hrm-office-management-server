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