const { ObjectId } = require("mongodb");
const { default: mongoose } = require("mongoose");
const Employee = require("./Employee");

const departmentSchema = mongoose.Schema({
    departmentName: {
        type: String,
        required: [true, "Department name required"]
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
    },
    employeeList: [{
        type: ObjectId,
        ref: Employee
    }]
})

const Department = mongoose.model("Department", departmentSchema)
module.exports = Department;