const { createRequisitionService, getAllRequisitionByUserEmailService, editRequisitionByIdService, getRequisitionDetailsByIdService, deleteRequisitionByIdService } = require("../services/Requisition.service");

exports.createRequisition = async (req, res) => {
    try {
        const requisitionData = req.body;

        const result = await createRequisitionService(requisitionData)

        if (result) {
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