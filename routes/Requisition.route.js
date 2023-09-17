const express = require('express')
const requisitionController = require('../controllers/Requisition.controller')


const router = express.Router()

router.route('/')
    .post(requisitionController.createRequisition)

module.exports = router;