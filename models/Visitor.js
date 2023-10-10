const { default: mongoose } = require("mongoose");

const visitorSchema = mongoose.Schema(
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

const Visitor = mongoose.model("Visitor", visitorSchema)
module.exports = Visitor;