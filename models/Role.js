const { ObjectId } = require("mongodb");
const { default: mongoose } = require("mongoose");

const roleSchema = mongoose.Schema({
    roleName: {
        type: String,
        required: [true, "Role name is required"]
    },
    pageAccess: [
        {
            type: ObjectId,
            ref: "Page"
        }
    ]
},
    {
        timestamps: true
    }
)


const Role = mongoose.model("Role", roleSchema);
module.exports = Role