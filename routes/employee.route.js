const express = require('express')
const employeeController = require('../controllers/employee.controller')

const router = express.Router();

router.post('/login', employeeController.login);
// router.get('/employeeByEmail/:email', employeeController.getEmployeeByEmail)

router.route('/employee-by-dept')
    .get(employeeController.getEmployeeByDepartment)

router.route('/leaveApplications/:id')
    .get(employeeController.getleaveHistoryByEmployeeId)

router.route('/leaveStatus/:id')
    .get(employeeController.getLeaveStatusByEmployeeId)

router.route('/requisition/:id')
    .get(employeeController.getAllRequisitionByEmployeeId)

router.route('/updatePassword/:email')
    .patch(employeeController.updateEmployeePasswordByEmail)

router.route('/resetPassword/:token')
    .get()

router.route('/')
    .post(employeeController.createEmployee)
    .get(employeeController.getAllEmployee)

router.route('/:id')
    .delete(employeeController.deleteEmployee)
    .get(employeeController.findEmployeeById)
    .patch(employeeController.updateEmployeeById)
// .get(employeeController.findEmployeeByEmail)


module.exports = router;