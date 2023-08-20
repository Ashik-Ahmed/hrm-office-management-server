
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
        }
    },
    {
        timestamp: true
    }
)

const Leave = mongoose.model("Leave", leaveSchema);

module.exports = Leave;