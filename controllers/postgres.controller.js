const { getPostgresDataService } = require("../services/a2pReport.service");

exports.getPostgresData = async (req, res) => {
    try {
        const { date } = req.query;

        const data = await getPostgresDataService(date)
        // const data = await getPostgresDataService()



        if (data.rowCount > 0) {
            res.status(200).json({
                status: "Succes",
                data: data.rows
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