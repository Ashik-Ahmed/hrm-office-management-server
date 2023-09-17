const { ObjectId } = require("mongodb");
const { default: mongoose } = require("mongoose");

const requiitionSchema = mongoose.Schema({
    submittedBy: {
        type: ObjectId,
        ref: Employee,
        required: [true, "Employee info required"]
    },
    department: {
        type: String,
    },
    status: {
        type: String
    },
    proposedAmount: {
        type: Number
    },
    finalAmount: {
        type: Number
    },
    itemList: [
        {
            category: { type: String },
            name: { type: String },
            model: { type: String },
            proposedQuantity: { type: Number },
            appvedQuantity: { type: Number },
            unitPrice: { type: Number }

        }
    ]
})

const Requisition = mongoose.model('Requisition', requiitionSchema);
module.exports = Requisition;