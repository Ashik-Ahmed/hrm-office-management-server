const { createNewTaskService } = require("../services/task.service");

exports.createNewTask = async (req, res) => {
    try {
        // console.log(req.body);
        const result = await createNewTaskService(req.body)

        if (result._id) {
            res.status(200).json({
                status: "Success",
                data: result
            })
        }
        else {
            res.status(400).json({
                status: "Failed",
                error: "Failed to create new task"
            })
        }

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}