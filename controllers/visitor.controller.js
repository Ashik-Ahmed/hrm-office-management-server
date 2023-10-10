const { createNewVisitorService, getMonthlyVisitorService } = require("../services/visitor.service");

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

exports.getMonthlyVisitor = async (req, res) => {
    try {
        const month = parseInt(req.query.month || (new Date().getMonth() + 1))
        const year = parseInt(req.query.year || new Date().getFullYear())

        const visitors = await getMonthlyVisitorService(month, year);

        if (visitors.length > 0) {
            res.status(200).json({
                status: "Success",
                data: visitors
            })
        }
        else {
            res.status(400).json({
                status: "Failed",
                error: "No visitor found"
            })
        }

    } catch (error) {
        res.status(500).json({
            status: "Failed",
            error: error.message
        })
    }
}