const { leaveApplicationService, getLeaveApplicationsByIdService, getPendingLeaveApplications } = require("../services/leaveApplication.service")


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

exports.getLeaveApplicationsById = async (req, res) => {
    try {
        const { employeeId } = req.params
        const leaveApplicatins = await getLeaveApplicationsByIdService(employeeId);

        if (leaveApplicatins) {
            res.status(200).json({
                status: "Success",
                data: leaveApplicatins
            })
        }
        else {
            res.status(400).json({
                status: "Failed",
                error: "Failed! Please try again"
            })
        }
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}

exports.getPendingLeaveApplications = async (req, res) => {
    try {
        const pendingLeaveApplications = await getPendingLeaveApplications();

        if (pendingLeaveApplications) {
            res.status(200).json({
                status: "Success",
                data: pendingLeaveApplications
            })
        }
        else {
            res.status(400).json({
                status: "Failed",
                error: "No data found"
            })
        }

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}