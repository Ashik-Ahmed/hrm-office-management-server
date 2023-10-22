const express = require('express');
const taskController = require('../controllers/task.controller')

const router = express.Router()

router.route('/')
    .post(taskController.createNewTask)
    .get(taskController.getAllTasks)

router.route('/:id')
    .patch(taskController.updateTaskById)


module.exports = router;