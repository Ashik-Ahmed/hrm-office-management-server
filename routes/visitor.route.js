const express = require('express');
const visitorController = require("../controllers/visitor.controller")

const router = express.Router();


router.route('/')
    .post(visitorController.createNewVisitor)


module.exports = router;