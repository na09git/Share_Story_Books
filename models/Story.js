const mongoose = require('mongoose')
const multer = require('multer');

const StorySchema = new mongoose.Schema({
  image: {
    data: Buffer, // Store the image data as a buffer
    contentType: String, // Store the content type of the image
  },
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


module.exports = mongoose.model('Story', StorySchema)
