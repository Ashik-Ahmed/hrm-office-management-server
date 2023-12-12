const Employee = require("../models/Employee");
const { createEmployeeService, getAllEmployeeService, deleteEmployeeByIdService, findEmployeeByEmailService, findEmployeeByIdService, getleaveHistoryByEmployeeIdService, getLeaveStatusByEmployeeIdService, getAllRequisitionByEmployeeIdService, updateEmployeeByIdService, updateEmployeePasswordByEmailService, getEmployeeByDepartmentService, findEmployeeByTokenService } = require("../services/employee.service");
const { generateToken } = require("../utils/token");

exports.createEmployee = async (req, res) => {
    console.log(req.body);
    try {
        const employee = await createEmployeeService(req.body);
        console.log(employee);
        if (employee) {
            res.status(200).json({
                status: 'Success',
                message: 'Successfully created User',
                data: employee
            })
        }
        else {
            res.status(400).json({
                status: 'Failed',
                message: 'Failed! Try again.'
            })
        }
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}

// exports.getEmployeeByEmail = async (req, res) => {
//     try {
//         const { email } = req.params;
//         console.log(email);
//         const employee = await Employee.find({ email })

//         if (employee) {
//             res.status(200).json({
//                 status: 'Success',
//                 data: employee
//             })
//         }
//         else {
//             res.status(500).json({
//                 status: 'Failed',
//                 message: 'Failed! Try again.'
//             })
//         }

//     } catch (error) {
//         res.status(500).json({
//             status: 'Failed',
//             error: error.message
//         })
//     }
// }


// get employee by email address 
exports.findEmployeeByEmail = async (req, res) => {
    try {
        const employeeEmail = req.params;
        const employee = await findEmployeeByEmailService(employeeEmail);

        if (employee) {
            res.status(200).json({
                status: 'Success',
                data: employee
            })
        }
        else {
            res.status(500).json({
                status: 'Failed',
                message: 'Failed! Try again.'
            })
        }

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }

}


// user login 
exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;
        console.log(email, password);

        if (!email || !password) {
            return res.status(401).json({
                status: 'Failed',
                error: 'please provide email and password'
            })
        }

        const employee = await findEmployeeByEmailService(email);
        console.log('employee from controller', employee);

        if (!employee) {
            return res.status(401).json({
                status: 'Failed',
                error: 'No employee found'
            })
        }

        const isPasswordMatched = await employee.comparePassword(password, employee.password);

        if (!isPasswordMatched) {
            return res.status(403).json({
                status: 'Failed',
                error: 'Password is not correct'
            })
        }

        const token = generateToken(employee);
        const { password: pwd, ...others } = employee.toObject();
        others.name = `${others.firstName} ${others.lastName}`
        // console.log('Found employee:', others);

        res.status(200).json({
            status: 'Success',
            message: 'Successfully logged in',
            data: {
                employee: {
                    ...others,
                    accessToken: token
                },
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'Failed',
            error: error.message,
        })
    }
}

exports.findEmployeeById = async (req, res) => {
    try {

        const { id } = req.params;
        const employee = await findEmployeeByIdService(id)

        if (!employee) {
            res.status(400).json({
                status: 'Failed',
                message: 'No Employee Found'
            })
        }

        res.status(200).json({
            status: 'Success',
            data: employee
        })

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}



exports.getAllEmployee = async (req, res) => {
    try {
        const employees = await getAllEmployeeService()

        if (!employees) {
            return res.status(401).json({
                status: 'Failed',
                error: 'Failed! Try again.'
            })
        }

        res.status(200).json({
            status: 'Success',
            data: {
                employees
            }
        })

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message,
        })
    }
}

exports.getEmployeeByDepartment = async (req, res) => {
    try {

        const { department } = req.query;
        console.log(department);

        const employees = await getEmployeeByDepartmentService(department);
        if (employees.length > 0) {
            res.status(200).json({
                status: "Success",
                data: employees
            })
        }

        else {
            res.status(400).json({
                status: "Failed",
                error: "No employee found"
            })
        }

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message,
        })
    }
}

exports.updateEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        console.log(id, data);

        const result = await updateEmployeeByIdService(id, data);
        console.log(result);
        if (result.modifiedCount > 0) {
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

// update user password 
exports.updateEmployeePasswordByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const { currentPassword, newPassword, confirmPassword } = req.body;

        //compare new passwords
        if (newPassword !== confirmPassword) {
            return res.status(500).json({
                status: 'Failed',
                error: "New password didn't match"
            })
        }
        if (newPassword.length < 6) {
            return res.status(401).json({
                status: "Failed",
                error: "New Password too short"
            })
        }

        const employee = await findEmployeeByEmailService(email)

        const isPasswordMatched = employee.comparePassword(currentPassword, employee.password);
        if (!isPasswordMatched) {
            return res.status(402).json({
                status: 'Failed',
                error: "Current password is wrong"
            })
        }

        const result = await updateEmployeePasswordByEmailService(email, req.body.newPassword);

        if (result.modifiedCount > 0) {
            return res.status(200).json({
                status: 'Success',
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
            status: 'Failed',
            error: error.message,
        })
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;

        const employee = await findEmployeeByTokenService(token);

        if (!employee) {
            res.status(401).json({
                status: "Failed",
                error: "Token Expired"
            })
        }

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message,
        })
    }
}

exports.deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteEmployeeByIdService(id)

        if (!result) {
            return res.status(401).json({
                status: 'Failed',
                error: 'Failed! Try again.'
            })
        }

        else {
            res.status(200).json({
                status: 'Success',
                data: result
            })
        }

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message,
        })
    }
}

exports.getleaveHistoryByEmployeeId = async (req, res) => {
    try {
        const { id } = req.params;
        const leaveHistory = await getleaveHistoryByEmployeeIdService(id);
        if (!leaveHistory) {
            return res.status(401).json({
                status: 'Failed',
                error: 'No leave history found'
            })
        }
        else {
            res.status(200).json({
                status: 'Success',
                data: leaveHistory
            })
        }

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message,
        })
    }
}


exports.getLeaveStatusByEmployeeId = async (req, res) => {
    try {
        const { id } = req.params;
        const { year } = req.query;

        const leaveStatus = await getLeaveStatusByEmployeeIdService(id, year)

        if (leaveStatus) {
            res.status(200).json({
                status: "Success",
                data: leaveStatus
            })
        }
        else {
            res.status(400).json({
                status: "Failed",
                error: "No Leave Status"
            })
        }

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message,
        })
    }
}


exports.getAllRequisitionByEmployeeId = async (req, res) => {
    try {
        const { id: employeeId } = req.params;
        const query = req.query;
        console.log(employeeId, query);
        const requisitions = await getAllRequisitionByEmployeeIdService(employeeId, query);

        if (requisitions.length > 0) {
            res.status(200).json({
                status: 'Success',
                data: requisitions
            })
        }
        else {
            res.status(400).json({
                status: 'Failed',
                error: 'No requisition found'
            })
        }
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}