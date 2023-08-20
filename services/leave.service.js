const Leave = require("../models/Leave")

exports.createLeaveService = async (leaveInfo) => {
    const leave = await Leave.create(leaveInfo)

    return leave;
}