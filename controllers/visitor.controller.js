const { createNewVisitorService } = require("../services/visitor.service");

exports.createNewVisitor = async (req, res) => {
    try {
        const visitorData = req.body;

        const visitor = await createNewVisitorService(visitorData)

        if (visitor._id) {
            res.status(200).json({
                status: "Success",
                data: visitor
            })
        }
        else {
            res.status(400).json({
                status: "Failed",
                error: "Failed to insert into DB"
            })
        }

    } catch (error) {
        res.status(500).json({
            status: "Failed",
            error: error.message
        })
    }
}