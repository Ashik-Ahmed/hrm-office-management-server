const { leaveApplicationService } = require("../services/leaveApplication.service")


exports.leaveApplication = async (req, res) => {
    try {
        const leaveApplication = await leaveApplicationService(req.body)

        if (leaveApplication) {
            res.status(200).json({
                status: 'Success',
                data: leaveApplication
            })
        }
        else {
            res.status(400).json({
                status: 'Failed',
                error: "Failed! Please try again."
            })
        }

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}