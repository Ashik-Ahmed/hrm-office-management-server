const { ObjectId } = require("mongodb");
const { default: mongoose } = require("mongoose");

const holidaySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Holiday title is required"]
    },
    date: {
        type: Date,
        required: [true, "Holiday date is required"]
    },
    description: {
        type: String
    },
    createdBy: {
        type: ObjectId,
        ref: "Employee",
    },
    updatedBy: {
        type: ObjectId,
        ref: "Employee",
    }
},
    {
        timestamps: true
    }
)

const Holiday = mongoose.model("Holiday", holidaySchema);
module.exports = Holiday;