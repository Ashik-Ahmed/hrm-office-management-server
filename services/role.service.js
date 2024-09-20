const Role = require("../models/Role")

exports.createNewRoleService = async (data) => {
    const role = await Role.create(data)
    return role
}

exports.getAllRoleService = async () => {
    const roles = await Role.find({}, { _id: 1, roleName: 1, users: 1, pageAccess: 1 }).populate({
        path: 'users',
        select: 'firstName lastName image department -_id',
        model: 'Employee'
    })
    return roles;
}

exports.editRoleByIdService = async (id, data) => {

    const editRole = await Role.updateOne({ _id: id }, data);

    return editRole;
}

exports.removeEmployeeIdFromRoleService = async (id) => {
    console.log(id);
    // Find the role that contains the user
    const role = await Role.findOne({ users: id });

    if (!role) {
        throw new Error('Role containing the user not found');
    }

    // Remove the user from that role
    const removeEmployee = await Role.updateOne({ _id: role._id }, { $pull: { users: id } });

    return removeEmployee;
}