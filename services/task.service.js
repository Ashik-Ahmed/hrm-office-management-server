const { default: mongoose } = require("mongoose");
const Task = require("../models/Task")

exports.createNewTaskService = async (taskData) => {
    console.log(taskData);
    const result = await Task.create(taskData)
    // console.log(result);
    return result;
}

exports.getTaskByIdService = async (taskId) => {
    const task = await Task.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(taskId) }
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
                assigneeEmail: {
                    $arrayElemAt: ["$Assignee.email", 0]
                },
                heading: 1,
                description: 1,
                currentStatus: 1,
                department: 1,
                createdAt: 1,
                updatedAt: 1,
                updates: 1
            }
        }
    ]);

    return task[0];
}


exports.getAllTasksService = async (employee, query) => {
    // console.log(employee);

    const { page = 0, limit = 10 } = query;
    const queryObject = { ...query }
    console.log(queryObject);
    const excludeFields = ['page', 'sort', 'limit'];

    excludeFields.forEach(field => delete queryObject[field])

    console.log(queryObject);

    let tasks, totalDocuments;

    // if employee is management send all the tasks 
    if (employee?.department == "Management") {

        totalDocuments = await Task.aggregate([
            {
                $match: queryObject
            },
            {
                $count: 'totalDocumentCount'
            }
        ]);

        tasks = await Task.aggregate([
            {
                $match: queryObject
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
                    totalDocuments: 1,
                    heading: 1,
                    currentStatus: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $skip: (parseInt(page) * parseInt(limit))
            },
            {
                $limit: parseInt(limit)
            }
        ]);
    }

    //if employee is not management check the other conditions
    else {

        totalDocuments = await Task.aggregate([
            {
                $match: {
                    $and: [
                        queryObject,
                        {
                            $or: [
                                { department: employee.department },
                                { creator: new mongoose.Types.ObjectId(employee._id) },
                                { assignee: new mongoose.Types.ObjectId(employee._id) }
                            ]
                        }
                    ]
                }
            },
            {
                $count: 'totalDocumentCount'
            }
        ])

        tasks = await Task.aggregate([
            {
                $match: {
                    $and: [
                        queryObject,
                        {
                            $or: [
                                { department: employee.department },
                                { creator: new mongoose.Types.ObjectId(employee._id) },
                                { assignee: new mongoose.Types.ObjectId(employee._id) }
                            ]
                        }
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
                    totalDocuments: 1,
                    heading: 1,
                    currentStatus: 1,
                    createdAt: 1,
                    updatedAt: 1,
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $skip: (parseInt(page) * parseInt(limit))
            },
            {
                $limit: parseInt(limit)
            }
        ]);
    }
    console.log(totalDocuments[0].totalDocumentCount, parseInt(limit));

    const totalPage = Math.ceil(totalDocuments[0]?.totalDocumentCount / parseInt(limit));
    console.log(totalPage);
    const taskData = { totalPage, tasks }

    return taskData;
}

exports.updateTaskByIdService = async (taskId, updatedData) => {
    console.log(taskId, updatedData);
    let result;
    if (updatedData.updateMessage) {
        const update = updatedData.updates
        result = await Task.updateOne({ _id: taskId }, { $push: { updates: updatedData } });
    }
    else {
        result = await Task.updateOne({ _id: taskId }, updatedData);
    }

    return result;
}

exports.getRunningTasks = async () => {
    let tasks;

    // if employee is management send all the tasks 
    if (employee.department == "Management") {
        // console.log('Employee is management');
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
        // console.log('Employee is not management');
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
}