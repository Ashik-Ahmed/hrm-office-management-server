const { createEmployeeService, findEmployeeByEmail, getAllEmployeeService, deleteEmployeeByIdService, findEmployeeByEmailService } = require("../services/employee.service");
const { generateToken } = require("../utils/token");

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

        const employee = await findEmployeeByEmail(email);

        if (!employee) {
            return res.status(401).json({
                status: 'Failed',
                error: 'No employee found'
            })
        }

        const isPasswordMatched = employee.comparePassword(password, employee.password);

        if (!isPasswordMatched) {
            return res.status(403).json({
                status: 'Failed',
                error: 'Password is not correct'
            })
        }

        const token = generateToken(employee);
        const { password: pwd, ...others } = employee.toObject();
        others.name = `${others.firstName} ${others.lastName}`
        console.log('Found employee:', others);

        res.status(200).json({
            status: 'Success',
            message: 'Successfully logged in',
            data: {
                employee: others,
                token
            }
        })

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message,
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

        res.status(200).json({
            status: 'Success',
            data: result
        })

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message,
        })
    }
}