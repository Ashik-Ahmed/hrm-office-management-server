const express = require('express')
const leaveController = require('../controllers/leave.controller')


const router = express.Router();

router.route('/')
    .get(leaveController.getAllLeave)
    .post(leaveController.createLeave)

module.exports = router