const Task = require("../models/Task")

exports.createNewTaskService = async (taskData) => {
    // console.log(taskData);
    const result = await Task.create(taskData)
    // console.log(result);
    return result;
}


exports.getAllTasksService = async () => {
    const tasks = await Task.find();
    return tasks;
}

exports.updateTaskByIdService = async (taskId, updatedData) => {

    let result;
    if (updatedData.updates) {
        const update = updatedData.updates
        result = await Task.updateOne({ _id: taskId }, { $push: { updates: update } });
    }
    else {
        result = await Task.updateOne({ _id: taskId }, updatedData);
    }

    return result;
}