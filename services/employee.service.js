const Employee = require("../models/Employee");

//create a new user
exports.createEmployeeService = async (employeeInfo) => {
    // console.log(employeeInfo);

    const employee = await Employee.create(employeeInfo);
    return employee;
}

// find a user by email 
exports.findEmployeeByEmail = async (email) => {
    const employee = await Employee.findOne({ email });
    return employee
}

//find all users
exports.getAllEmployeeService = async () => {
    const employee = await Employee.aggregate([
        {
            $project: {
                email: 1,
                firstName: 1,
                lastName: 1,
                userRole: 1,
                designation: 1,
                photo: 1,
                joiningDate: 1,
            }
        }
    ])
    return employee;
}

//delete a user by id
exports.deleteEmployeeByIdService = async (id) => {
    const result = await Employee.deleteOne({ _id: id });
    return result;
}