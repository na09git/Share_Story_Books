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
// @route   POST /students
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

// @desc    Show all students who 
// @route   GET /students
router.get('/', ensureAuth, async (req, res) => {
    try {
        const student = await Student.find({ status: 'Paid' })
            .populate('user')
            .sort({ createdAt: 1 })
            .lean();

        res.render('student/index', {
            student,
        });
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});



// @desc    Show single student
// @route   GET /student/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let student = await Student.findById(req.params.id)
            .populate('user')
            .lean()

        if (!student) {
            return res.render('error/404')
        }

        if (student.user._id != req.user.id && student.status == 'Paid') {
            res.render('error/404')
        } else {
            res.render('student/show', {
                student,
            })
        }
    } catch (err) {
        console.error(err)
        res.render('error/404')
    }
})



// @desc    Show edit page
// @route   GET /student/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const student = await Student.findOne({
            _id: req.params.id,
        }).lean()

        if (!student) {
            return res.render('error/404')
        }

        if (student.user != req.user.id) {
            res.redirect('/student')
        } else {
            res.render('student/edit', {
                student,
            })
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})



// @desc    Update student
// @route   PUT /student/:id
router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let student = await Student.findById(req.params.id).lean()

        if (!student) {
            return res.render('error/404')
        }

        if (student.user != req.user.id) {
            res.redirect('/student')
        } else {
            student = await Student.findOneAndUpdate({ _id: req.params.id }, req.body, {
                student: true,
                runValidators: true,
            })

            res.redirect('/student')
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})


// @desc    Delete student
// @route   DELETE /student/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        let student = await Student.findById(req.params.id).lean()

        if (!student) {
            return res.render('error/404')
        }

        if (student.user != req.user.id) {
            res.redirect('/student')
        } else {
            await Student.deleteOne({ _id: req.params.id })
            res.redirect('/student')
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})



// @desc    User student
// @route   GET /student/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        const student = await Student.find({
            user: req.params.userId,
            status: 'Paid',
        })
            .populate('user')
            .lean()

        res.render('student/index', {
            student,
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})


//@desc Search student by title
//@route GET /student/search/:query
router.get('/search/:query', ensureAuth, async (req, res) => {
    try {
        const student = await Student.find({ title: new RegExp(req.query.query, 'i'), status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()
        res.render('student/index', { news })
    } catch (err) {
        console.log(err)
        res.render('error/404')
    }
})

module.exports = router