const express = require('express')
const leaveApplicationController = require('../controllers/leaveApplication.controller')


const router = express.Router();


router.route('/')
    .post(leaveApplicationController.leaveApplication)

router.route('/:employeeId')
    .get(leaveApplicationController.getLeaveApplicationsById)


module.exports = router