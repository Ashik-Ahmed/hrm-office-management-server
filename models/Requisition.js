const { ObjectId } = require("mongodb");
const { default: mongoose } = require("mongoose");
const Employee = require("./Employee");

const requiitionSchema = mongoose.Schema({
    submittedBy: {
        type: ObjectId,
        ref: Employee,
        required: [true, "Employee info required"]
    },
    // date: {
    //     type: Date,
    //     default: new Date()
    // },
    department: {
        type: String,
    },
    status: {
        type: String,
        default: "Pending"
    },
    proposedAmount: {
        type: Number
    },
    purchasedAmount: {
        type: Number
    },
    purchasedItems: {
        type: Number
    },
    itemList: [
        {
            category: { type: String },
            name: { type: String },
            model: { type: String },
            proposedQuantity: { type: Number },
            // approvedQuantity: { type: Number },
            unitPrice: { type: Number },
            // buyingPrice: { type: Number }

        }
    ]
},
    {
        timestamps: true,
    }
)

const Requisition = mongoose.model('Requisition', requiitionSchema);
module.exports = Requisition;