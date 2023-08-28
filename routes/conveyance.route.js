const express = require('express')
const conveyanceController = require('../controllers/conveyance.controller')

const router = express.Router()

router.route('/')
    .post(conveyanceController.createConveyance)

router.route('/:employeeEmail')
    .get(conveyanceController.getConveyanceByEmployeeEmail)


module.exports = router