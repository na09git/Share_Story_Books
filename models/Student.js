
const mongoose = require('mongoose')

const StudentSchema = new mongoose.Schema({
    name:
    {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
    },
    image: {
        data: {
            type: Buffer,
        },
        contentType: {
            type: String,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

})

module.exports = mongoose.model('Student', StudentSchema)
