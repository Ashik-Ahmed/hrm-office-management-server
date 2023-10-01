const Department = require("../models/Department");

exports.createDepartmentService = async (data) => {
    const result = await Department.create(data)
    return result;
}

exports.getAllDepartmentService = async () => {
    console.log('get all edpartment service');
}

