const mongoose = require('mongoose')

const NewsSchema = new mongoose.Schema({
    image: [
        {
            data: { type: Buffer }, // Store the image data as a buffer
            content: { type: String }, // Store the content type of the image
        }
    ],
    title: {
        type: String,
        required: true,
        trim: true,
    },
    body: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'public',
        enum: ['public', 'private'],
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

module.exports = mongoose.model('News', NewsSchema)
