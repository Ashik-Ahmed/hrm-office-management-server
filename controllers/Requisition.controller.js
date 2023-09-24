const { createRequisitionService, getAllRequisitionByUserEmailService, editRequisitionByIdService } = require("../services/Requisition.service");

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

