const express = require('express')
const employeeController = require('../controllers/employee.controller')

const router = express.Router();

router.post('/login', employeeController.login);

router.route('/leaveApplications/:id')
    .get(employeeController.getleaveHistoryByEmployeeId)

router.route('/leaveStatus/:id')
    .get(employeeController.getLeaveStatusByEmployeeId)

router.route('/requisition/:id')
    .get(employeeController.getAllRequisitionByEmployeeId)

router.route('/')
    .post(employeeController.createEmployee)
    .get(employeeController.getAllEmployee)

router.route('/:id')
    .delete(employeeController.deleteEmployee)
    .get(employeeController.findEmployeeById)
// .get(employeeController.findEmployeeByEmail)


module.exports = router;