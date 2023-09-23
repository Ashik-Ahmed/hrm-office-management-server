const express = require('express')
const conveyanceController = require('../controllers/conveyance.controller')

const router = express.Router()

router.route('/makePayment')
    .patch(conveyanceController.makePaymentConveyanceBill)

router.route('/')
    .post(conveyanceController.createConveyance)
    .get(conveyanceController.getAllEmployeeMonthlyConveyance)

router.route('/:employeeEmail')
    .get(conveyanceController.getConveyanceByEmployeeEmail)

router.route('/:id')
    .delete(conveyanceController.deleteConveyanceById)
    .patch(conveyanceController.editConveyanceById)


module.exports = router