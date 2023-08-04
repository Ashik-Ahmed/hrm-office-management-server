const { leaveApplicationService } = require("../services/leaveApplication.service")


exports.leaveApplication = async (req, res) => {
    try {
        leaveApplicationService(req.body)

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}