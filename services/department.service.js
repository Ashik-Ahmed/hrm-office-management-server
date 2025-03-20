const Department = require("../models/Department");

exports.createDepartmentService = async (data) => {
    const result = await Department.create(data)
    return result;
}

exports.getAllDepartmentService = async (query) => {

    const departments = await Department.aggregate([
        {
            $match: query
        },
        {
            $project: {
                departmentName: 1,
                description: 1,
                status: 1,
                employeeCount: { $size: "$employeeList" }
            }
        }
    ]);
    return departments;
}

exports.updateDepartmentByIdService = async (deptId, updatedData) => {

    const result = await Department.updateOne({ _id: deptId }, updatedData)


    return result;
}

