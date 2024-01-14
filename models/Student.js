// student Schema
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
    status: {
        type: String,
        default: 'Paid',
        enum: ['Paid', 'Not-Paid'],
    },
    gender: {
        type: String,
        default: 'M',
        enum: ['M', 'F'],
    },
    imageBase64: {
        type: String,
        require: true,
    },
    contentType: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('Student', StudentSchema)
