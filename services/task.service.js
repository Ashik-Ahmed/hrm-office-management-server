const Task = require("../models/Task")

exports.createNewTaskService = async (taskData) => {
    // console.log(taskData);
    const result = await Task.create(taskData)
    console.log(result);
    return result;
}