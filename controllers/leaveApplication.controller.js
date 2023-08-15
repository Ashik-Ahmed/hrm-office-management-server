const { leaveApplicationService, getPendingLeaveApplications, updateLeaveApplicationStatusService, getLeaveApplicationsByEmployeeIdService } = require("../services/leaveApplication.service")


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

exports.updateLeaveApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        console.log("controller:", id, data);

        // const updateStatus = await updateLeaveApplicationStatusService({ employeeId, data })

        // return updateStatus;

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}