const { createRequisitionService, getAllRequisitionByUserEmailService, editRequisitionByIdService, getRequisitionDetailsByIdService, deleteRequisitionByIdService, getMonthlyRequisitionDataService, completePurchaseByIdSevice } = require("../services/Requisition.service");
const { sendEmail } = require("../utils/sendEmail");

exports.createRequisition = async (req, res) => {
    try {
        const requisitionData = req.body;

        const result = await createRequisitionService(requisitionData)

        if (result?._id) {
            const requisitionDetails = await getRequisitionDetailsByIdService(result?._id)
            // console.log(requisitionDetails);

            // send email
            const emailInfo = {
                to: 'mnp.desk@infotelebd.com',
                subject: 'New Requisition',
                body: ` <p>Dear Concern,</p> <p>${requisitionDetails?.submittedBy?.name} just submitted a requisition. The requisition details are given below.
                <br>
                <br>
                <b>Department:</b> ${requisitionDetails?.department}
                <br>
                 <b>Total items:</b> ${requisitionDetails?.totalProposedItems}
                <br>
                <b>Total amount:</b> ${requisitionDetails?.proposedAmount}
                <br>
                <br>
                Click <a href="http://localhost:3000/manage-requisition">here</a> to review the requisition.
                <br>
                <br> 
                <p>Thank you.</p>`
            }

            await sendEmail(emailInfo);


            res.status(200).json({
                status: "Success",
                data: result
            })
        }
        else {
            res.status(400).json({
                status: "Failed",
                error: "Pease try again"
            })
        }

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}

exports.getRequisitionDetailsById = async (req, res) => {
    try {
        const { id } = req.params;
        const requisitionDetails = await getRequisitionDetailsByIdService(id)
        console.log(requisitionDetails);

        if (requisitionDetails) {
            res.status(200).json({
                status: "Success",
                data: requisitionDetails
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

exports.getMonthlyRequisitionData = async (req, res) => {
    try {
        const query = req.query;
        const requisitionData = await getMonthlyRequisitionDataService(query)

        if (requisitionData) {
            res.status(200).json({
                status: "Success",
                data: requisitionData
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

exports.completePurchaseById = async (req, res) => {
    try {
        const { id } = req.params;
        let data = req.body;

        const result = await completePurchaseByIdSevice(id, data)
        console.log(result);
        if (result.modifiedCount > 0) {
            res.status(200).json({
                status: "Success",
                data: result
            })
        }

        else {
            res.status(400).json({
                status: "Failed",
                error: "Please try again"
            })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}

exports.deleteRequisitionById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteRequisitionByIdService(id);

        if (result.deletedCount > 0) {
            res.status(200).json({
                status: "Success",
                data: result
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