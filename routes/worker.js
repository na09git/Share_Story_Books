const path = require('path');
const express = require('express')
const { ensureAuth } = require('../middleware/auth')
const multer = require('multer');
const mongoose = require('mongoose');
const router = express.Router()


const Worker = require('../models/Worker')


// image Upload // Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploadworker')
    },
    filename: function (req, file, cb) {
        cb(null, path.extname(file.originalname) + Date.now())
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: '1000000' },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/
        const mimeType = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))

        if (mimeType && extname) {
            return cb(null, true)
        }
        cb('Give Proper files formate to upload')
    }
}).single('image')

// Create multer instance


// @desc    Show addworker page
// @route   GET /worker/addworker
router.get('/addworker', ensureAuth, (req, res) => {
    res.render('worker/addworker', { title: "Worker Page" })
})


// @desc    Process add member form
// @route   POST /workers
router.post('/', ensureAuth, upload, async (req, res) => {
    try {
        req.body.user = req.user.id
        if (req.file) {
            req.body.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            }
        }
        await Worker.create(req.body)
        res.redirect('/worker')
        req.session.message = {
            type: "success",
            message: "User Added Successfully!"
        }
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

// @desc    Show all workers who 
// @route   GET /workers
router.get('/', ensureAuth, upload, async (req, res) => {
    try {
        const worker = await Worker.find({ status: 'Paid' })
            .populate('user')
            .sort({ createdAt: 1 })
            .lean();

        res.render('worker/index', {
            worker,
        });
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});



// @desc    Show single worker
// @route   GET /worker/:id
router.get('/:id', ensureAuth, upload, async (req, res) => {
    try {
        let worker = await Worker.findById(req.params.id)
            .populate('user')
            .lean()

        if (!worker) {
            return res.render('error/404')
        }

        if (worker.user._id != req.user.id && worker.status == 'Paid') {
            res.render('error/404')
        } else {
            res.render('worker/show', {
                worker,
            })
        }
    } catch (err) {
        console.error(err)
        res.render('error/404')
    }
})



// @desc    Show edit page
// @route   GET /worker/edit/:id
router.get('/edit/:id', ensureAuth, upload, async (req, res) => {
    try {
        const worker = await Worker.findOne({
            _id: req.params.id,
        }).lean()

        if (!worker) {
            return res.render('error/404')
        }

        if (worker.user != req.user.id) {
            res.redirect('/worker')
        } else {
            res.render('worker/edit', {
                worker,
            })
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})



// @desc    Update worker
// @route   PUT /worker/:id
router.put('/:id', ensureAuth, upload, async (req, res) => {
    try {
        let worker = await Worker.findById(req.params.id).lean()

        if (!worker) {
            return res.render('error/404')
        }

        if (worker.user != req.user.id) {
            res.redirect('/worker')
        } else {
            worker = await Worker.findOneAndUpdate({ _id: req.params.id }, req.body, {
                worker: true,
                runValidators: true,
            })

            res.redirect('/worker')
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})


// @desc    Delete worker
// @route   DELETE /worker/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        let worker = await Worker.findById(req.params.id).lean()

        if (!worker) {
            return res.render('error/404')
        }

        if (worker.user != req.user.id) {
            res.redirect('/worker')
        } else {
            await Worker.deleteOne({ _id: req.params.id })
            res.redirect('/worker')
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})



// @desc    User worker
// @route   GET /worker/user/:userId
router.get('/user/:userId', ensureAuth, upload, async (req, res) => {
    try {
        const worker = await Worker.find({
            user: req.params.userId,
            status: 'Paid',
        })
            .populate('user')
            .lean()

        res.render('worker/index', {
            worker,
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})


//@desc Search worker by title
//@route GET /worker/search/:query
router.get('/search/:query', ensureAuth, async (req, res) => {
    try {
        const worker = await Worker.find({ title: new RegExp(req.query.query, 'i'), status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()
        res.render('worker/index', { news })
    } catch (err) {
        console.log(err)
        res.render('error/404')
    }
})

module.exports = router