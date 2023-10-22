const { default: mongoose } = require("mongoose");
const Task = require("../models/Task")

exports.createNewTaskService = async (taskData) => {
    // console.log(taskData);
    const result = await Task.create(taskData)
    // console.log(result);
    return result;
}

exports.getTaskByIdService = async (taskId) => {
    const task = await Task.findById({ _id: taskId });

    return task;
}


exports.getAllTasksService = async (employee) => {
    console.log(employee);
    let tasks;

    // if employee is management send all the tasks 
    if (employee.department == "Management") {
        tasks = await Task.aggregate([
            {
                $lookup: {
                    from: "employees",
                    localField: "creator",
                    foreignField: "_id",
                    as: "Creator"
                }
            },
            {
                $lookup: {
                    from: "employees",
                    localField: "assignee",
                    foreignField: "_id",
                    as: "Assignee"
                }
            },
            {
                $project: {
                    creator: {
                        $concat: [
                            { $arrayElemAt: ["$Creator.firstName", 0] },
                            " ",
                            { $arrayElemAt: ["$Creator.lastName", 0] },
                        ]
                    },
                    assignee: {
                        $concat: [
                            { $arrayElemAt: ["$Assignee.firstName", 0] },
                            " ",
                            { $arrayElemAt: ["$Assignee.lastName", 0] },
                        ]
                    },
                    heading: 1,
                    currentStatus: 1,
                    updatedAt: 1
                }
            }
        ]);
    }

    //if employee is not management check the other conditions
    else {
        tasks = await Task.aggregate([
            {
                $match: {
                    $or: [
                        { department: employee.department },
                        { creator: new mongoose.Types.ObjectId(employee._id) },
                        { assignee: new mongoose.Types.ObjectId(employee._id) }
                    ]
                }
            },
            {
                $lookup: {
                    from: "employees",
                    localField: "creator",
                    foreignField: "_id",
                    as: "Creator"
                }
            },
            {
                $lookup: {
                    from: "employees",
                    localField: "assignee",
                    foreignField: "_id",
                    as: "Assignee"
                }
            },
            {
                $project: {
                    creator: {
                        $concat: [
                            { $arrayElemAt: ["$Creator.firstName", 0] },
                            " ",
                            { $arrayElemAt: ["$Creator.lastName", 0] },
                        ]
                    },
                    assignee: {
                        $concat: [
                            { $arrayElemAt: ["$Assignee.firstName", 0] },
                            " ",
                            { $arrayElemAt: ["$Assignee.lastName", 0] },
                        ]
                    },
                    heading: 1,
                    currentStatus: 1,
                    updatedAt: 1
                }
            }
        ]);
    }
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