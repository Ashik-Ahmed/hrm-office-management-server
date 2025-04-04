const { createDepartmentService, getAllDepartmentService, updateDepartmentByIdService } = require("../services/department.service");

exports.createDepartment = async (req, res) => {
    try {
        const data = req.body;
        const result = await createDepartmentService(data);

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

        const query = req.query;

        const departments = await getAllDepartmentService(query);

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

exports.updateDepartmentById = async (req, res) => {
    try {
        const updatedData = req.body;
        const { id } = req.params;

        const result = await updateDepartmentByIdService(id, updatedData);

        if (result.modifiedCount > 0) {
            res.status(200).json({
                status: "Success",
                data: result
            })
        }

        else {
            res.status(400).json({
                status: "Failed",
                error: "Failed to update"
            })
        }

    } catch (error) {
        res.status(500).json({
            status: "Failed",
            error: error.message
        })
    }
}