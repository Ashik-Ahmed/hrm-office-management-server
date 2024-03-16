const express = require('express')
const leaveController = require('../controllers/leave.controller');
const verifyToken = require('../middleware/verifyToken');


const router = express.Router();

router.route('/')
    .get(verifyToken, leaveController.getAllLeave)
    .post(verifyToken, leaveController.createLeave)

router.route('/:id')
    .patch(verifyToken, leaveController.updateLeaveById)
    .delete(verifyToken, leaveController.deleteLeaveById)



module.exports = router