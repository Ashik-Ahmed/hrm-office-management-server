const express = require('express');
const { createHoliday } = require('../controllers/holiday.controller');
const verifyToken = require('../middleware/verifyToken');
const authorization = require('../middleware/authorization');

const router = express.Router();


router.route('/')
    .get()
    .post(verifyToken, authorization('Super Admin'), createHoliday)
    .patch()
    .delete()


module.exports = router