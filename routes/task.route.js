const express = require('express');
const taskController = require('../controllers/task.controller')

const router = express.Router()

router.route('/')
    .post(taskController.createNewTask)
    .get(taskController.getAllTasks)

router.route('/:id')
    .get(taskController.getTaskById)
    .patch(taskController.updateTaskById)


module.exports = router;