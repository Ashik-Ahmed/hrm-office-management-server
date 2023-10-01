const { createRequisitionService, getAllRequisitionByUserEmailService, editRequisitionByIdService, getRequisitionDetailsByIdService, deleteRequisitionByIdService, getMonthlyRequisitionDataService, completePurchaseByIdSevice } = require("../services/Requisition.service");

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