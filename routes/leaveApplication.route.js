const express = require('express')
const leaveApplicationController = require('../controllers/leaveApplication.controller')


const router = express.Router();


router.route('/pendingApplications')
    .get(leaveApplicationController.getPendingLeaveApplications)

router.route('/')
    .post(leaveApplicationController.leaveApplication)

router.route('/:employeeId')
    .get(leaveApplicationController.getLeaveApplicationsByEmployeeId)
    .patch(leaveApplicationController.updateLeaveApplicationStatus)


module.exports = router