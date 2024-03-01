const { leaveApplicationService, getPendingLeaveApplications, updateLeaveApplicationStatusService, getLeaveApplicationsByEmployeeIdService, getAllLeaveApplicationsService } = require("../services/leaveApplication.service")


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

exports.getAllLeaveApplications = async (req, res) => {
    try {
        const query = req.query;
        // console.log(query);
        const leaveApplications = await getAllLeaveApplicationsService(query);

        if (leaveApplications) {
            res.status(200).json({
                status: "Success",
                data: leaveApplications
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

        const updateStatus = await updateLeaveApplicationStatusService({ id, data })

        if (updateStatus.modifiedCount > 0) {
            res.status(200).json({
                status: "Success",
                data: updateStatus
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