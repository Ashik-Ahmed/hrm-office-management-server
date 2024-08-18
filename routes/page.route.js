const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const { createNewPage, getAllPage } = require('../controllers/page.controller');


const router = express.Router();

router.route('/')
    .post(verifyToken, createNewPage)
    .get(verifyToken, getAllPage)

module.exports = router