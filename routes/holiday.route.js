const express = require('express');
const { createHoliday, getAllHoliday, deleteHolidayById, editHolidayById } = require('../controllers/holiday.controller');
const verifyToken = require('../middleware/verifyToken');
const authorization = require('../middleware/authorization');

const router = express.Router();


router.route('/')
    .get(verifyToken, getAllHoliday)
    .post(verifyToken, authorization('Super Admin'), createHoliday)
    .patch()
    .delete()

router.route('/:id')
    .get()
    .patch(verifyToken, authorization('Super Admin'), editHolidayById)
    .delete(verifyToken, authorization('Super Admin'), deleteHolidayById)


module.exports = router