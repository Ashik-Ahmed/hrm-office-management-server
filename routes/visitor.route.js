const express = require('express');
const visitorController = require("../controllers/visitor.controller");
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();


router.route('/')
    .get(verifyToken, visitorController.getMonthlyVisitor)
    .post(verifyToken, visitorController.createNewVisitor)


module.exports = router;