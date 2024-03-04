const { leaveApplicationService, updateLeaveApplicationStatusService, getAllLeaveApplicationsService } = require("../services/leaveApplication.service")
const { sendEmail } = require("../utils/sendEmail")


exports.leaveApplication = async (req, res) => {
    try {
        const leaveApplication = await leaveApplicationService(req.body)

        if (leaveApplication) {

            const emailInfo = {
                to: "ashik@infotelebd.com",
                subject: "New Leave Application",
                body: ` <p>Dear Concern,</p> <p>${leaveApplication?.employee?.name} just submitted a leave application. The leave application details are given below.
                </br>
                </br>
                Leave Type: ${leaveApplication?.leaveType}
                </br>
                Start Date: ${leaveApplication?.fromDate}
                </br>
                End Date: ${leaveApplication?.toDate}
                </br>
                Total days: ${leaveApplication?.totalDay}

                </p>
                </br>
                </br>
                <p>Please take necessary action.</p>
                </br>
                </br>
                <p>Thank you.</p>
                `
            }

            await sendEmail(emailInfo)

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