const Department = require("../models/Department");

exports.createDepartmentService = async (data) => {
    const result = await Department.create(data)
    return result;
}

exports.getAllDepartmentService = async () => {
    const departments = await Department.aggregate([
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


