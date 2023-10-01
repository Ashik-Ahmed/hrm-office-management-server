const Department = require("../models/Department");

exports.createDepartmentService = async (data) => {
    const result = await Department.create(data)
    return result;
}

exports.getAllDepartmentService = async () => {
    const departments = await Department.find({});
    return departments;
}

