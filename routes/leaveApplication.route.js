const express = require('express')
const leaveApplicationController = require('../controllers/leaveApplication.controller');
const verifyToken = require('../middleware/verifyToken');


const router = express.Router();


// router.route('/pendingApplications')
//     .get(leaveApplicationController.getPendingLeaveApplications)

router.route('/')
    .post(verifyToken, leaveApplicationController.leaveApplication)
    .get(verifyToken, leaveApplicationController.getAllLeaveApplications)

router.route('/:id')
    .patch(verifyToken, leaveApplicationController.updateLeaveApplicationStatus)


module.exports = router