const express = require('express')
const requisitionController = require('../controllers/Requisition.controller')
const verifyToken = require('../middleware/verifyToken')


const router = express.Router()

router.route('/cancelRequisition/:id')
    .patch(verifyToken, requisitionController.cancelRequisitionById)

router.route('/')
    .get(verifyToken, requisitionController.getMonthlyRequisitionData)
    .post(verifyToken, requisitionController.createRequisition)

router.route('/:id')
    .get(verifyToken, requisitionController.getRequisitionDetailsById)
    .delete(verifyToken, requisitionController.deleteRequisitionById)
    .patch(verifyToken, requisitionController.completePurchaseById)

module.exports = router;