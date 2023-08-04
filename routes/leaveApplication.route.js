const express = require('express')
const leaveApplicationController = require('../controllers/leaveApplication.controller')


const router = express.Router();


router.route('/')
    .post(leaveApplicationController.leaveApplication)


module.exports = router