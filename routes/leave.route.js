const express = require('express')
const leaveController = require('../controllers/leave.controller')


const router = express.Router();

router.route('/')
    // .get()
    .post(leaveController.createLeave)

module.exports = router