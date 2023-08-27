const { createConveyanceService } = require("../services/conveyance.service")

exports.createConveyance = async (req, res) => {
    try {
        const conveyanceData = req.body
        const result = await createConveyanceService(conveyanceData)

        console.log(result);

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}