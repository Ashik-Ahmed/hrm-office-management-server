const { createNewRoleService, getAllRoleService } = require("../services/role.service");


exports.createNewRole = async (req, res) => {
    try {
        const roleData = req.body;

        const role = await createNewRoleService(roleData);

        if (role?._id) {
            res.status(200).json({
                status: 'Success',
                data: role
            })
        }
        else {
            res.status(400).json({
                status: 'Failed',
                error: 'Failed to create new role'
            })
        }
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}


exports.getAllRole = async (req, res) => {
    try {
        const role = await getAllRoleService();
        if (role.length > 0) {
            res.status(200).json({
                status: 'Success',
                data: role
            })
        }
        else {
            res.status(400).json({
                status: 'Failed',
                error: 'No role found'
            })
        }
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}