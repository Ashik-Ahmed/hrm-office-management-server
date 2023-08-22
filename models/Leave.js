
const { default: mongoose } = require("mongoose");

const leaveSchema = mongoose.Schema(
    {
        leaveType: {
            type: String,
            required: [true, "Leave Type is required"]
        },
        total: {
            type: Number,
            required: [true, "Total is required"]
        },
        description: {
            type: String
        },
        createdBy: {
            type: "String",
            required: [true, "User is not available"]
        },
        updatedBy: {
            type: "String"
        }
    },
    {
        timestamps: true
    }
)

const Leave = mongoose.model("Leave", leaveSchema);

module.exports = Leave;