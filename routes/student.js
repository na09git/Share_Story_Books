const fs = require('fs');
const express = require('express');
const multer = require('multer');
const { ensureAuth } = require('../middleware/auth');
const router = express.Router();
const Student = require('../models/Student');

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploadstudent');
    },
    filename: function (req, file, cb) {
        var ext = file.originalname.substr(file.originalname.lastIndexOf('.'));
        cb(null, file.fieldname + '-' + Date.now() + ext);
    }
});

const upload = multer({ storage: storage });

// @desc Show add student page
// @route GET /student/addstudent
router.get('/addstudent', ensureAuth, (req, res) => {
    res.render('student/addstudent', { title: 'Student Page' });
});


// @desc Process add student form with image upload
// @route POST /student
router.post('/', ensureAuth, upload.single('image'), async (req, res) => {
    try {
        const file = req.file;

        if (!file || file.length === 0) {
            const error = new Error('Please choose files');
            error.httpStatusCode = 400;
            throw error;
        }

        const img = fs.readFileSync(file.path);
        const encode_image = img.toString('base64');

        const newUpload = new Student({
            ...req.body,
            user: req.user.id,
            contentType: file.mimetype,
            imageBase64: encode_image,
        });

        try {
            await newUpload.save();
            res.redirect('/student');
        } catch (error) {
            if (error.name === 'MongoError' && error.code === 11000) {
                return res.status(400).json({ error: `Duplicate ${file.originalname}. File Already exists! ` });
            }
            return res.status(500).json({ error: error.message || `Cannot Upload ${file.originalname} Something Missing!` });
        }
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message || 'Internal Server Error' });
    }
});


// @desc Show all students
// @route GET /student/index
router.get('/', ensureAuth, async (req, res) => {
    try {
        const students = await Student.find()
            .populate('user')
            .sort({ createdAt: 1 })
            .lean();

        res.render('student/index', { students });
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});


// @desc Show single student
// @route GET /student/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)
            .populate('user')
            .lean();

        if (!student) {
            return res.render('error/404');
        }

        if (student.user._id != req.user.id) {
            return res.render('error/404');
        }

        res.render('student/show', { student });
    } catch (err) {
        console.error(err);
        res.render('error/404');
    }
});


// @desc Show edit page
// @route GET /student/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).lean();

        if (!student) {
            return res.render('error/404');
        }

        if (student.user.toString() !== req.user.id) {
            return res.redirect('/student');
        }

        res.render('student/edit', { student });
    } catch (err) {
        console.error(err);
        return res.render('error/500');
    }
});


// @desc Update student
// @route PUT /student/:id
router.put('/:id', ensureAuth, upload.single('image'), async (req, res) => {
    console.log('Update route reached'); // Add this line
    try {
        let student = await Student.findById(req.params.id).lean();

        if (!student) {
            return res.render('error/404');
        }

        if (student.user.toString() !== req.user.id) {
            return res.redirect('/student');
        }

        const file = req.file;
        const existingImage = student.imageBase64;

        let updatedFields = req.body;

        if (file) {
            const img = fs.readFileSync(file.path);
            const encode_image = img.toString('base64');
            updatedFields = {
                ...updatedFields,
                contentType: file.mimetype,
                imageBase64: encode_image,
            };
        } else {
            // Retain the existing image if no new image is provided
            updatedFields = {
                ...updatedFields,
                contentType: student.contentType,
                imageBase64: existingImage,
            };
        }

        student = await Student.findOneAndUpdate(
            { _id: req.params.id },
            updatedFields,
            { new: true, runValidators: true }
        );

        res.redirect('/student');
    } catch (err) {
        console.error(err);
        return res.render('error/500');
    }
});



// @desc Delete student
// @route DELETE /student/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        let student = await Student.findById(req.params.id).lean();

        if (!student) {
            return res.render('error/404');
        }

        if (student.user != req.user.id) {
            res.redirect('/student');
        } else {
            await Student.deleteOne({ _id: req.params.id });
            res.redirect('/student');
        }
    } catch (err) {
        console.error(err);
        return res.render('error/500');
    }
});



// @desc User student
// @route GET /student/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        const students = await Student.find({
            user: req.params.userId,
            status: 'Paid',
        }).populate('user').lean();

        res.render('student/index', {
            students,
        });
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

//@desc Search student by title
//@route GET /student/search/:query
router.get('/search/:query', ensureAuth, async (req, res) => {
    try {
        const students = await Student.find({ name: new RegExp(req.query.query, 'i'), status: 'Paid' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean();
        res.render('student/index', { students });
    } catch (err) {
        console.log(err);
        res.render('error/404');
    }
});


module.exports = router