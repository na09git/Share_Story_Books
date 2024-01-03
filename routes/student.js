const express = require('express')
const { ensureAuth } = require('../middleware/auth')
const multer = require('multer');
const mongoose = require('mongoose');
const router = express.Router()


const Student = require('../models/Student')


// image Upload // Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploadstudent")
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + file.originalname + '-' + Date.now())
    },
})
// Create multer instance
const upload = multer({ storage: storage }).single('image')


// @desc    Show addstudent page
// @route   GET /student/addstudent
router.get('/addstudent', ensureAuth, (req, res) => {
    res.render('student/addstudent', { title: "Student Page" })
})


// @desc    Process add member form
// @route   POST /student
router.post('/', ensureAuth, upload, async (req, res) => {
    try {
        req.body.user = req.user.id
        if (req.file) {
            req.body.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            }
        }
        await Student.create(req.body)
        res.redirect('/student')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

module.exports = router