const mongoose = require('mongoose')
const multer = require('multer');

const WorkerSchema = new mongoose.Schema({
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
    salary: {
        type: String,
        required: true,

    },
    gender: {
        type: String,
        default: 'M',
        enum: ['M', 'F'],
    },
    image: {
        data: {
            type: Buffer,
        },
        contentType: {
            type: String,
        },
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

module.exports = mongoose.model('Worker', WorkerSchema)
