const express = require('express');
const taskController = require('../controllers/task.controller')

const router = express.Router()

router.route('/get-all-task/:employeeEmail')
    .get(taskController.getAllTasks)    //only get if the employee is an assignee and his own dept tasks. Management will get all dept. tasks

router.route('/')
    .post(taskController.createNewTask)
// .get(taskController.getAllTasks)

router.route('/:id')
    .get(taskController.getTaskById)
    .patch(taskController.updateTaskById)


module.exports = router;