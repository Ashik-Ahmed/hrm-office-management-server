const { createNewPageService, getAllPageService } = require("../services/page.service");

exports.createNewPage = async (req, res) => {
    try {
        const pagedata = req.body;

        const page = await createNewPageService(pagedata);

        if (page._id) {
            res.status(200).json({
                status: "Success",
                data: page
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
            status: "Failed",
            error: error.message
        })
    }
}

exports.getAllPage = async (req, res) => {
    try {
        const page = await getAllPageService();
        if (page.length > 0) {
            res.status(200).json({
                status: "Success",
                data: page
            })
        }
        else {
            res.status(400).json({
                status: "Failed",
                error: "No page found"
            })
        }
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            error: error.message
        })
    }

}