const Role = require("../models/Role")

exports.createNewRoleService = async (data) => {
    const role = await Role.create(data)
    return role
}

exports.getAllRoleService = async () => {
    const role = await Role.find({}, { _id: 1, roleName: 1 })
    return role
}