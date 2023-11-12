const { default: mongoose } = require("mongoose");
const Employee = require("../models/Employee");
const { createNewTaskService, getAllTasksService, updateTaskByIdService, getTaskByIdService } = require("../services/task.service");

exports.createNewTask = async (req, res) => {
    try {
        const taskData = req.body;
        const creator = await Employee.findOne({ email: taskData.creator }, { id: 1 })
        console.log(creator);
        taskData.creator = creator._id;
        const result = await createNewTaskService(taskData)
        console.log(result);

        if (result._id) {
            res.status(200).json({
                status: "Success",
                data: result
            })
        }
        else {
            res.status(400).json({
                status: "Failed",
                error: "Failed to create new task"
            })
        }

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}

exports.getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await getTaskByIdService(id);

        if (task) {
            res.status(200).json({
                status: "Success",
                data: task
            })
        }
        else {
            res.status(400).json({
                status: "Failed",
                error: "No task found"
            })
        }
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}

exports.getAllTasks = async (req, res) => {
    try {
        const { employeeEmail } = req.params;
        // console.log(req.params);

        const employee = await Employee.findOne({ email: employeeEmail }, { firstName: 1, lastName: 1, department: 1 })
        console.log(employee);

        if (!employee) {
            res.status(401).json({
                status: "Failed",
                error: "Please login first!"
            })
        }

        const taskData = await getAllTasksService(employee, req.query)
        if (taskData?.tasks?.length > 0) {
            res.status(200).json({
                status: "Success",
                data: taskData
            })
        }
        else {
            res.status(400).json({
                status: "Failed",
                error: "No task found"
            })
        }
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}

exports.updateTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const result = await updateTaskByIdService(id, updatedData)

        if (result.modifiedCount > 0) {
            res.status(200).json({
                status: "Success",
                data: result
            })
        }
        else {
            res.status(400).json({
                status: "Failed",
                error: "Failed to update"
            })
        }
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}