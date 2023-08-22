const { createLeaveService, getAllLeaveService, updateLeaveByIdService } = require("../services/leave.service")

exports.createLeave = async (req, res) => {
    try {
        const leave = await createLeaveService(req.body);

        if (leave) {
            res.status(200).json({
                status: "Success",
                data: leave
            })
        }
        else {
            res.status(400).json({
                status: "Failed",
                error: "Please try again"
            })
        }
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}

exports.getAllLeave = async (req, res) => {
    try {
        const leaves = await getAllLeaveService()

        if (leaves) {
            res.status(200).json({
                status: "Success",
                data: leaves
            })
        }
        else {
            res.status(400).json({
                status: "Failed",
                error: "Please try again"
            })
        }
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}

exports.updateLeaveById = async (req, res) => {
    try {
        const updateResult = await updateLeaveByIdService(req.body)

        if (updateResult) {
            res.status(200).json({
                status: "Success",
                data: updateResult
            })
        }
        else {
            res.status(400).json({
                status: "Failed",
                error: "Failed to update"
            })
        }

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}