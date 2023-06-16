const express = require('express')
const employeeController = require('../controllers/employee.controller')

const router = express.Router();

router.post('/login', employeeController.login);

router.route('/')
    .post(employeeController.createEmployee)
    .get(employeeController.getAllEmployee)

router.route('/:id')
    .delete(employeeController.deleteEmployee)
    .get(employeeController.findEmployeeByEmail)


module.exports = router;