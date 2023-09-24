const { createEmployeeService, findEmployeeByEmail, getAllEmployeeService, deleteEmployeeByIdService, findEmployeeByEmailService, findEmployeeByIdService, getleaveHistoryByEmployeeIdService, getLeaveStatusByEmployeeIdService, getAllRequisitionByEmployeeIdService } = require("../services/employee.service");
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
        const requisitions = await getAllRequisitionByEmployeeIdService(employeeId);

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