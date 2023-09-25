const express = require('express')
const requisitionController = require('../controllers/Requisition.controller')


const router = express.Router()

router.route('/')
    .post(requisitionController.createRequisition)

router.route('/:id')
    .get(requisitionController.getRequisitionDetailsById)

module.exports = router;