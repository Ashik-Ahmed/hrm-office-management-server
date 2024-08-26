const Employee = require("../models/Employee");
const { createEmployeeService, getAllEmployeeService, deleteEmployeeByIdService, findEmployeeByEmailService, findEmployeeByIdService, getleaveHistoryByEmployeeIdService, getLeaveStatusByEmployeeIdService, getAllRequisitionByEmployeeIdService, updateEmployeeByIdService, updateEmployeePasswordByEmailService, getEmployeeByDepartmentService, findEmployeeByTokenService, loginByEmailService } = require("../services/employee.service");
const { sendEmail } = require("../utils/sendEmail");
const { generateToken } = require("../utils/token");
// const app = require('../app')
// const express = require('express');
// const path = require('path');


// app.use(express.static(path.join(__dirname, 'utils')));


exports.createEmployee = async (req, res) => {
    // console.log(req.body);
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
    // console.log(req.body);
    try {

        const { email, password } = req.body;
        // console.log(email, password);

        if (!email || !password) {
            return res.status(401).json({
                status: 'Failed',
                error: 'please provide email and password'
            })
        }

        const employee = await loginByEmailService(email);
        // console.log('employee from controller', employee);

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
        // console.log(error);
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
        // console.log(department);

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
        // console.log(result);
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

exports.updatePasswordByToken = async (req, res) => {
    try {
        const { token } = req.params;
        // console.log(token);

        const employee = await findEmployeeByTokenService(token);
        // console.log(employee);
        if (!employee) {
            res.send(`<h2>Invalid token</h2>
            <p>Request could not be processed</p>`);
        }

        else {
            const date = new Date()
            // console.log(date, employee.passwordResetTokenExpires);

            // if the current time is greater than expired time, the token is expired 
            const isTokenExpired = date > employee.passwordResetTokenExpires;
            // console.log(isTokenExpired);

            if (isTokenExpired) {
                res.send(`<h2>Sorry, Your token has expired</h2> <p>Please try again!!</p>`);
            }

            else {
                res.send(`<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reset Password</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 100vh;
                    }
            
                    .reset-container {
                        background-color: #fff;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        padding: 20px;
                        border-radius: 8px;
                        width: 300px;
                        text-align: center;
                    }
            
                    h2 {
                        color: #333;
                    }
            
                    input {
                        width: 100%;
                        padding: 10px;
                        margin: 10px 0;
                        box-sizing: border-box;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                    }
            
                    button {
                        background-color: #4caf50;
                        color: #fff;
                        padding: 10px 15px;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                    }
            
                    button:hover {
                        background-color: #45a049;
                    }
                </style>
            </head>
            <body>
            
            <div class="reset-container">
                <h2>Reset Password</h2>
                <form action="#" method="post">
                    <input type="password" name="password" placeholder="New Password" required>
                    <input type="password" name="confirmPassword" placeholder="Confirm Password" required>
                    <button type="submit">Reset Password</button>
                </form>
            </div>
            
            </body>
            </html>
            `)
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
                        <a href="${req.protocol}://${req.get("host")}${req.baseUrl}/reset-password/${token}" 
                           style="background-color: #007BFF; color: white; padding: 10px 20px; text-decoration: none; 
                                  border-radius: 5px; display: inline-block; font-size: 16px;">
                            Reset Your Password
                        </a>
                    </p>
                    
                    <p>If the button above doesn’t work, copy and paste the following link into your web browser:</p>
                    <p style="word-wrap: break-word; font-size:12px">${req.protocol}://${req.get("host")}${req.baseUrl}/reset-password/${token}</p>
                    
                    <p><strong>Note:</strong> The link will be valid for 5 minutes.</p>
                    
                    <p>Thank you,<br>The Team</p>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #777;">If you didn't request a password reset, please ignore this email.</p>
                </div>
                `
            };


            const emailSend = await sendEmail(emailInfo)

            if (emailSend.messageId) {
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
        // console.log(employeeId, query);
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