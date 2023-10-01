const { createDepartmentService, getAllDepartmentService } = require("../services/department.service");

exports.createDepartment = async (req, res) => {
    try {
        const data = req.body;
        const result = await createDepartmentService(data);
        console.log(result);
        if (result._id) {
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
            status: "Failed",
            error: error.message
        })
    }
}

exports.getAllDepartment = async (req, res) => {
    try {
        const departments = await getAllDepartmentService();

        if (departments) {
            res.status(200).json({
                status: "Success",
                data: departments
            })
        }

        else {
            res.status(400).json({
                status: "Failed",
                error: "No department found"
            })
        }

    } catch (error) {
        res.status(500).json({
            status: "Failed",
            error: error.message
        })
    }
}