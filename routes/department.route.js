const express = require('express')
const departmentController = require('../controllers/department.controller')

const router = express.Router();

router.route('/')
    .get(departmentController.getAllDepartment)
    .post(departmentController.createDepartment)


module.exports = router;