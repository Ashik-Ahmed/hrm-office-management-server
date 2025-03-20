const Employee = require("../models/Employee");
const { createEmployeeService, getAllEmployeeService, deleteEmployeeByIdService, findEmployeeByEmailService, findEmployeeByIdService, getleaveHistoryByEmployeeIdService, getLeaveStatusByEmployeeIdService, getAllRequisitionByEmployeeIdService, updateEmployeeByIdService, updateEmployeePasswordByEmailService, getEmployeeByDepartmentService, findEmployeeByTokenService, loginByEmailService, updatePasswordByTokenService } = require("../services/employee.service");
const { removeEmployeeIdFromRoleService } = require("../services/role.service");
const { sendEmail } = require("../utils/sendEmail");
const { generateToken } = require("../utils/token");
// const app = require('../app')
// const express = require('express');
// const path = require('path');


// app.use(express.static(path.join(__dirname, 'utils')));


exports.createEmployee = async (req, res) => {

    try {
        const employee = await createEmployeeService(req.body);

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
// exports.findEmployeeByEmail = async (req, res) => {
//     try {
//         const employeeEmail = req.params;
//         const employee = await findEmployeeByEmailService(employeeEmail);

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


// user login 
exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;


        if (!email || !password) {
            return res.status(401).json({
                status: 'Failed',
                error: 'please provide email and password'
            })
        }

        const employee = await loginByEmailService(email);


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
        const { password: pwd, userRole, ...others } = employee.toObject();
        others.name = `${others.firstName} ${others.lastName}`;
        others.userRole = employee.userRole.roleName;
        others.pageAccess = employee.userRole.pageAccess;


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
        const query = req.query;
        const employees = await getAllEmployeeService(query)


        if (employees.length <= 0) {
            return res.status(401).json({
                status: 'Failed',
                error: 'No employee found'
            })
        }

        else {
            res.status(200).json({
                status: 'Success',
                data: {
                    employees
                }
            })
        }

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

        const result = await updateEmployeeByIdService(id, data);

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

exports.checkPasswordResetTokenValidity = async (req, res) => {
    try {
        const { token } = req.params;

        const employee = await findEmployeeByTokenService(token);

        const date = new Date();
        const isTokenExpired = date > employee?.passwordResetTokenExpires;

        if (!employee?.passwordResetToken || isTokenExpired) {
            res.status(400).json({
                status: 'Failed',
                error: 'Invalid token'
            })
        }

        else {
            res.status(200).json({
                status: 'Success',
                data: employee
            })
        }

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}

exports.updatePasswordByToken = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                status: 'Failed',
                error: "Password didn't match"
            })
        }

        const employee = await findEmployeeByTokenService(token);

        if (!employee) {
            res.status(400).json({
                status: 'Failed',
                error: 'Invalid token'
            })
        }

        else {
            const date = new Date();

            // if the current time is greater than expired time, the token is expired 
            const isTokenExpired = date > employee.passwordResetTokenExpires;

            if (isTokenExpired) {
                res.status(400).json({
                    status: 'Failed',
                    error: 'Token expired'
                })
            }

            else {
                const updatePassword = await updatePasswordByTokenService(token, newPassword);

                if (updatePassword.modifiedCount > 0) {
                    res.status(200).json({
                        status: 'Success',
                        data: updatePassword
                    })
                }

                else {
                    res.status(400).json({
                        status: 'Failed',
                        error: 'Please try again'
                    })
                }
            }
        }
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message,
        })
    }
}

exports.sendResetPasswordEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const { resetPasswordUrl } = req.body;


        // const employee = await findEmployeeByTokenService(token);

        const employee = await findEmployeeByEmailService(email)

        const token = employee.generateResetPasswordToken();

        await employee.save({ validateBeforeSave: false })

        if (!employee) {
            res.status(401).json({
                status: "Failed",
                error: "Invalid employee email"
            })
        }
        else {

            // const emailInfo = {
            //     to: employee.email,
            //     subject: "Reset your Password",
            //     body: `Dear ${employee.firstName} ${employee.lastName}, <br> You have requested to change your current password. Click the following link to reset: <a href=${req.protocol}://${req.get("host")}${req.baseUrl}/reset-password/${token}>Click here</a> <br><br> The link will be valid for 5 minutes. <br><br> Thank you.`,
            // }

            const emailInfo = {
                to: employee.email,
                subject: "Password Reset Request",
                body: `
                <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                    <p>Dear ${employee.firstName} ${employee.lastName},</p>

                    <p>You recently requested to reset your password. Please click the button below to proceed with the password reset.</p>

                    <p style="text-align: center;">
                        <a href="${resetPasswordUrl}/${token}" 
                           style="background-color: #007BFF; color: white; padding: 10px 20px; text-decoration: none; 
                                  border-radius: 5px; display: inline-block; font-size: 16px;">
                            Reset Your Password
                        </a>
                    </p>

                    <p>If the button above doesn’t work, copy and paste the following link into your web browser:</p>
                    <p style="word-wrap: break-word; font-size:12px">${resetPasswordUrl}/${token}</p>

                    <p><strong>Note:</strong> The link will be valid for 5 minutes.</p>

                    <p>Thank you,<br>The Team</p>

                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #777;">If you didn't request a password reset, please ignore this email.</p>
                </div>
                `
            };


            const emailSend = await sendEmail(emailInfo)

            if (emailSend?.messageId) {
                res.status(200).json({
                    status: "Success",
                    data: "Password reset email sent"
                })
            }
            else {
                res.status(400).json({
                    status: "Failed",
                    error: "Email send failed"
                })
            }
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
        const removeFromRoles = await removeEmployeeIdFromRoleService(id)


        if (result?.deletedCount > 0 && removeFromRoles?.modifiedCount > 0) {
            res.status(200).json({
                status: 'Success',
                data: result
            })
        }

        else {
            return res.status(401).json({
                status: 'Failed',
                error: 'Failed! Try again.'
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
        const query = req.query;

        const leaveHistory = await getleaveHistoryByEmployeeIdService(id, query);
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