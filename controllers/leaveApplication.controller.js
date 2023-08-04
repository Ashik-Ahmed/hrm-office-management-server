

exports.leaveApplication = async (req, res) => {
    try {
        console.log(req.body);

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}