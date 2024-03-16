const express = require('express');
const taskController = require('../controllers/task.controller');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router()

router.route('/get-all-task/:employeeEmail')
    .get(verifyToken, taskController.getAllTasks)    //only get if the employee is an assignee and his own dept tasks. Management will get all dept. tasks

router.route('/')
    .post(verifyToken, taskController.createNewTask)
// .get(taskController.getAllTasks)

router.route('/:id')
    .get(verifyToken, taskController.getTaskById)
    .patch(verifyToken, taskController.updateTaskById)


module.exports = router;