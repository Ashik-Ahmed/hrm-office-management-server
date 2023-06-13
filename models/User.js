const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require('bcryptjs');



const userSchema = mongoose.Schema(
    {
        employeeId: {
            type: Number
        },
        email: {
            type: String,
            validate: [validator.isEmail, "Please provide a valid email"],
            trim: true,
            lowercase: true,
            unique: [true, 'Duplicate Email'],
            required: [true, 'Email address is required'],
        },

        password: {
            type: String,
            default: 123456,
        },

        userRole: {
            type: String,
            enum: ['Admin', 'User'],
            default: 'User',
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

        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date
    },

    {
        timestamps: false,
    }
);

userSchema.pre('save', function (next) {
    const password = this.password;

    const hashedPassword = bcrypt.hashSync(password);

    this.password = hashedPassword;

    next();
})


userSchema.methods.comparePassword = function (password, hash) {
    const isPasswordMatched = bcrypt.compareSync(password, hash);
    return isPasswordMatched;
}



const User = mongoose.model('User', userSchema);
module.exports = User;