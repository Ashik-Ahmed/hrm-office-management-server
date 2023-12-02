const express = require('express')
const departmentController = require('../controllers/department.controller');

const router = express.Router();

router.route('/')
    .get(departmentController.getAllDepartment)
    .post(departmentController.createDepartment)

router.route('/:id')
    .patch(departmentController.updateDepartmentById)

// router.route('/:id')
//     .delete()


module.exports = router;