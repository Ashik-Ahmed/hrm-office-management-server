const { ObjectId } = require("mongodb");
const { default: mongoose } = require("mongoose");
const moment = require('moment-timezone');


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
            type: Date,
            required: [true, "From date is required"]
        },
        toDate: {
            type: Date,
            required: [true, "To date is required"]
        },
        rejoinDate: {
            type: Date,
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
            },
            updatedBy: {
                type: String
            }
        },
        creationTime: {
            type: Date,
        },
        updateTime: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

// Pre-save middleware
leaveApplicationSchema.pre('save', function (next) {
    const bdTime = moment().tz('Asia/Dhaka');

    console.log(bdTime);
    this.updateTime = bdTime; // Set updateTime to current time
    if (!this.creationTime) {
        this.creationTime = bdTime; // Set creationTime only if it's not set
    }
    next();
});

// Pre-update middleware
leaveApplicationSchema.pre('findOneAndUpdate', function () {
    this.set({ updateTime: new Date() }); // Set updateTime to current time
});


const LeaveApplication = mongoose.model("LeaveApplication", leaveApplicationSchema);
module.exports = LeaveApplication;