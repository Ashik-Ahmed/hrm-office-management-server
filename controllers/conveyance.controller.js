const { createConveyanceService, getConveyanceByEmployeeEmailService, getAllEmployeeMonthlyConveyanceService, deleteConveyanceByIdServicce, makePaymentConveyanceBillService } = require("../services/conveyance.service")

exports.createConveyance = async (req, res) => {
    try {
        const conveyanceData = req.body
        // console.log(conveyanceData);
        const result = await createConveyanceService(conveyanceData)

        if (result._id) {
            res.status(200).json({
                status: "Success",
                data: result
            })
        }
        else {
            res.status(400).json({
                status: "Failed",
                error: result
            })
        }

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}

exports.deleteConveyanceById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await deleteConveyanceByIdServicce(id)

        if (result.deletedCount > 0) {
            res.status(200).json({
                status: "Success",
                data: result
            })
        }
        else {
            res.status(400).json({
                status: "Failed",
                error: "No Such Conveyance"
            })
        }

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}

exports.getConveyanceByEmployeeEmail = async (req, res) => {
    try {
        const { employeeEmail } = req.params;
        const query = req.query;
        // console.log(query);
        const conveyance = await getConveyanceByEmployeeEmailService(employeeEmail, query);

        if (conveyance) {
            res.status(200).json({
                status: "Success",
                data: conveyance
            })
        }

        else {
            res.status(400).json({
                status: "Failed",
                error: "No data found."
            })
        }
        // console.log(conveyance);

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}


exports.getAllEmployeeMonthlyConveyance = async (req, res) => {
    try {
        console.log(req.query);
        const allConveyances = await getAllEmployeeMonthlyConveyanceService(req.query)

        if (allConveyances) {
            res.status(200).json({
                status: "Success",
                data: allConveyances
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

exports.makePaymentConveyanceBill = async (req, res) => {
    try {
        // const data = JSON.parse(req.body)
        const pendingIds = req.body
        console.log('data: ', pendingIds);
        const result = await makePaymentConveyanceBillService(pendingIds)

        if (result.modifiedCount > 0) {
            res.status(200).json({
                status: 'Success',
                data: result
            })
        }
        else {
            res.status(400).json({
                status: 'Failed',
                error: 'Try again'
            })
        }

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}