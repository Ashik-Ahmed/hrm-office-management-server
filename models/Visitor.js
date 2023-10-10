const { default: mongoose } = require("mongoose");

const guestSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Guest name is required"]
        },
        mobile: {
            type: String,
        },
        designation: {
            type: String
        },
        company: {
            type: String
        },
        purpose: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

const Guest = mongoose.model("Guest", guestSchema)
module.exports = Guest;