const Employee = require("../models/Employee");

//create a new user
exports.createEmployeeService = async (employeeInfo) => {
    // console.log(employeeInfo);

    const employee = await Employee.create(employeeInfo);
    return employee;
}

//find a employee by Id
exports.findEmployeeByIdService = async (id) => {

    const employee = await Employee.findOne({ _id: id });
    return employee;
}

// find a user by email 
exports.findEmployeeByEmailService = async (email) => {

    const employee = await Employee.findOne({ email })
    // const employee = await Employee.aggregate([
    //     {
    //         $match: { email: email }
    //     },
    //     {
    //         $project: {
    //             email: 1,
    //             password: 1,
    //             // name: firstName + lastName,
    //             firstName: 1,
    //             lastName: 1,
    //             userRole: 1,
    //         }
    //     }
    // ])
    return employee;
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