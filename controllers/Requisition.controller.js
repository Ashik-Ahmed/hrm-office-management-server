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

exports.getAllRequisitionByUserEmail = async (req, res) => {
    try {
        const { id: employeeId } = req.params;
        const requisitions = await getAllRequisitionByUserEmailService(employeeId);

        if (requisitions.length > 0) {
            res.status(200).json({
                status: 'Success',
                data: requisitions
            })
        }
        else {
            res.status(400).json({
                status: 'Failed',
                error: 'No requisition found'
            })
        }
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}
