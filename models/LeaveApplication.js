const { ObjectId } = require("mongodb");
const { default: mongoose } = require("mongoose");


const leaveApplicationSchema = mongoose.Schema(
    {
        employee: {
            name: String,
            employeeId: {
                type: ObjectId,
                ref: "Employee",
                required: [true, "Employee Id required"]
            }
        },
        leaveType: {
            type: String,
            required: [true, "Leave Type is required"]
        },
        fromDate: {
            type: String,
            required: [true, "From date is required"]
        },
        toDate: {
            type: String,
            required: [true, "To date is required"]
        },
        rejoinDate: {
            type: String,
            required: [true, "Rejoining date is required"]
        },
        totalDay: {
            type: String,
            required: [true, "Total day is required"]
        },
        purpose: {
            type: String,
        },
        currentStatus: {
            status: {
                type: String,
                default: 'Pending'
            },
            reason: {
                type: String
            }
        }
    },
    {
        timestamps: true,
    }
);


const LeaveApplication = mongoose.model("LeaveApplication", leaveApplicationSchema);
module.exports = LeaveApplication;