const { createLeaveService } = require("../services/leave.service")

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