const express = require('express')
const conveyanceController = require('../controllers/conveyance.controller')
const verifyToken = require('../middleware/verifyToken')

const router = express.Router()

router.route('/makePayment')
    .patch(verifyToken, conveyanceController.makePaymentConveyanceBill)

router.route('/')
    .post(verifyToken, conveyanceController.createConveyance)
    .get(verifyToken, conveyanceController.getAllEmployeeMonthlyConveyance)

router.route('/:employeeEmail')
    .get(verifyToken, conveyanceController.getConveyanceByEmployeeEmail)

router.route('/:id')
    .delete(verifyToken, conveyanceController.deleteConveyanceById)
    .patch(verifyToken, conveyanceController.editConveyanceById)


module.exports = router