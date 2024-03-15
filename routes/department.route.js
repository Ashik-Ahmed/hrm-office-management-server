const express = require('express')
const departmentController = require('../controllers/department.controller');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.route('/')
    .get(verifyToken, departmentController.getAllDepartment)
    .post(verifyToken, departmentController.createDepartment)

router.route('/:id')
    .patch(verifyToken, departmentController.updateDepartmentById)

// router.route('/:id')
//     .delete()


module.exports = router;