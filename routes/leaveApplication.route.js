const express = require('express')
const leaveApplicationController = require('../controllers/leaveApplication.controller')


const router = express.Router();


// router.route('/pendingApplications')
//     .get(leaveApplicationController.getPendingLeaveApplications)

router.route('/')
    .post(leaveApplicationController.leaveApplication)
    .get(leaveApplicationController.getAllLeaveApplications)

router.route('/:id')
    .patch(leaveApplicationController.updateLeaveApplicationStatus)


module.exports = router