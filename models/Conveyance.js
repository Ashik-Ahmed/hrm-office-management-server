const { ObjectId } = require("mongodb");
const { default: mongoose } = require("mongoose");


const conveyanceSchema = mongoose.Schema(
    {
        employee: {
            name: String,
            email: String,
            employeeId: {
                type: ObjectId,
                ref: "Employee",
                required: [true, "Employee Id required"]
            }
        },
        from: {
            type: String,
            required: [true, "From location is required"]
        },
        destination: {
            type: String,
            required: [true, "Destination location is required"]
        },
        date: {
            type: Date,
            required: [true, "Journey date is required"]
        },
        amount: {
            type: Number,
            required: [true, "Amount is required"]
        },
        purpose: {
            type: String
        },
        partner: {
            type: String
        },
        paymentStatus: {
            type: String,
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
)

const Conveyance = mongoose.model("Conveyance", conveyanceSchema);
module.exports = Conveyance;
