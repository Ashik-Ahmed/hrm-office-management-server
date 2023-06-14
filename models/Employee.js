const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require('bcryptjs');



const employeeSchema = mongoose.Schema(
    {
        employeeId: {
            type: Number,
            unique: [true, 'Duplicate Employee ID'],
        },
        email: {
            type: String,
            validate: [validator.isEmail, "Please provide a valid email"],
            trim: true,
            lowercase: true,
            unique: [true, 'Duplicate Email'],
            required: [true, 'Email address is required'],
        },

        designation: {
            type: String,
            required: [true, 'Designation is required'],
            trim: true,
        },

        password: {
            type: String,
            default: 123456,
        },

        userRole: {
            type: String,
            enum: ['Super Admin', 'Admin', 'HR Admin', 'Accounts', 'Employee'],
            default: 'Employee',
        },

        firstName: {
            type: String,
            required: [true, 'First Name is required'],
            trim: true,
            minLength: [3, 'First Name must be at least 3 characters'],
            maxLength: [60, 'First Name length  is too large'],
        },
        lastName: {
            type: String,
            required: [true, 'Last Name is required'],
            trim: true,
            minLength: [3, 'Last Name must be at least 3 characters'],
            maxLength: [60, 'Last Name length  is too large'],
        },

        photo: {
            type: String,
            validate: [validator.isURL, 'PLease provide a valid url'],
        },

        joiningDate: {
            type: String,
        },

        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date
    },

    {
        timestamps: false,
    }
);

employeeSchema.pre('save', function (next) {
    const password = this.password;

    const hashedPassword = bcrypt.hashSync(password);

    this.password = hashedPassword;

    next();
})


employeeSchema.methods.comparePassword = function (password, hash) {
    const isPasswordMatched = bcrypt.compareSync(password, hash);
    return isPasswordMatched;
}



const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;