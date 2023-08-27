const express = require('express')
const conveyanceController = require('../controllers/conveyance.controller')

const router = express.Router()

router.route('/')
    .get(conveyanceController.getConveyanceByEmployeeEmail)
    .post(conveyanceController.createConveyance)


module.exports = router