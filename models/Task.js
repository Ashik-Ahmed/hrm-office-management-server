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
        department: {
            type: String,
            required: [true, "Department is missing"]
        },
        heading: {
            type: String,
            required: [true, "Task heading is missing"]
        },
        description: {
            type: String,
            required: [true, "Task description is missing"]
        },
        currentStatus: {
            type: String,
            default: "Open"
        },
        updates: [
            {
                updatedBy: { type: ObjectId, ref: Employee },
                updateMessage: { type: String },
                updateTime: { type: Date, default: Date.now }
            }
        ]
    },
    {
        timestamps: true,
    }
)

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;