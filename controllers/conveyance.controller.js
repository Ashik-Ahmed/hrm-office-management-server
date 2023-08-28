const { createConveyanceService, getConveyanceByEmployeeEmailService } = require("../services/conveyance.service")

exports.createConveyance = async (req, res) => {
    try {
        const conveyanceData = req.body

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

exports.getConveyanceByEmployeeEmail = async (req, res) => {
    try {
        const { employeeEmail } = req.params;
        const query = req.query;
        console.log(query);
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