const { default: mongoose } = require("mongoose");


const pageSchema = mongoose.Schema({
    serial: {
        type: Number,
        unique: [true, 'Duplicate Serial Number'],
        required: [true, "Serial number is required"]
    },
    title: {
        type: String,
        unique: [true, 'Duplicate Title'],
        required: [true, "Page title is required"]
    },
    url: {
        type: String,
        unique: [true, 'Duplicate Url'],
        required: [true, "Page url is required"]
    },
    accessLevel: {
        type: String,
        enum: ['Public', 'Private'],
        default: 'Public',
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
    },
},
    {
        timestamps: true
    }
)


const Page = mongoose.model("Page", pageSchema);
module.exports = Page