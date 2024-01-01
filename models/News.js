const mongoose = require('mongoose');
const multer = require('multer');

const NewsSchema = new mongoose.Schema({
    image: {
        data: Buffer, // Store the image data as a buffer
        contentType: String, // Store the content type of the image
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('News', NewsSchema);