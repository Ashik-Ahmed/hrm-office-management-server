const express = require('express')
const requisitionController = require('../controllers/Requisition.controller')


const router = express.Router()

router.route('/')
    .get(requisitionController.getMonthlyRequisitionData)
    .post(requisitionController.createRequisition)

router.route('/:id')
    .get(requisitionController.getRequisitionDetailsById)
    .delete(requisitionController.deleteRequisitionById)

module.exports = router;