const { ObjectId, Timestamp } = require("mongodb");
const { default: mongoose } = require("mongoose");
const Employee = require("./Employee");


const taskSchema = mongoose.Schema(
    {
        creator: {
            type: ObjectId,
            ref: Employee,
            required: [true, "Creator info missing"]
        },
        assignee: {
            type: ObjectId,
            ref: Employee,
            required: [true, "Assignee is missing"]
        },
        currentStatus: {
            type: String
        },
        updates: [
            {
                updatedBy: String,
                updateMessage: String,
                updateTime: Timestamp
            }
        ]
    },
    {
        timestamps: true,
    }
)

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;