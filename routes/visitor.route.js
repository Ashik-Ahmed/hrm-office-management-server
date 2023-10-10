const express = require('express');
const visitorController = require("../controllers/visitor.controller")

const router = express.Router();


router.route('/')
    .get(visitorController.getMonthlyVisitor)
    .post(visitorController.createNewVisitor)


module.exports = router;