const express = require('express')
const conveyanceController = require('../controllers/conveyance.controller')
const authorization = require('../middleware/authorization')

const router = express.Router()

router.route('/makePayment')
    .patch(authorization, conveyanceController.makePaymentConveyanceBill)

router.route('/')
    .post(authorization, conveyanceController.createConveyance)
    .get(authorization, conveyanceController.getAllEmployeeMonthlyConveyance)

router.route('/:employeeEmail')
    .get(authorization, conveyanceController.getConveyanceByEmployeeEmail)

router.route('/:id')
    .delete(authorization, conveyanceController.deleteConveyanceById)
    .patch(authorization, conveyanceController.editConveyanceById)


module.exports = router