const express = require('express')
const employeeController = require('../controllers/employee.controller');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.post('/login', employeeController.login);
// router.get('/employeeByEmail/:email', employeeController.getEmployeeByEmail)

router.route('/employee-by-dept')
    .get(verifyToken, employeeController.getEmployeeByDepartment)

router.route('/leaveApplications/:id')
    .get(verifyToken, employeeController.getleaveHistoryByEmployeeId)

router.route('/leaveStatus/:id')
    .get(verifyToken, employeeController.getLeaveStatusByEmployeeId)

router.route('/requisition/:id')
    .get(verifyToken, employeeController.getAllRequisitionByEmployeeId)

router.route('/updatePassword/:email')
    .patch(verifyToken, employeeController.updateEmployeePasswordByEmail)

router.route('/send-password-reset-email/:email')
    .get(verifyToken, employeeController.sendResetPasswordEmail)

router.route('/reset-password/:token')
    .get(employeeController.updatePasswordByToken)

router.route('/')
    .post(verifyToken, employeeController.createEmployee)
    .get(verifyToken, employeeController.getAllEmployee)

router.route('/:id')
    .delete(verifyToken, employeeController.deleteEmployee)
    .get(verifyToken, employeeController.findEmployeeById)
    .patch(verifyToken, employeeController.updateEmployeeById)
// .get(employeeController.findEmployeeByEmail)


module.exports = router;