const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const multer = require('multer');
const mongoose = require('mongoose');

const News = require('../models/News')


// image Upload // Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploadsnews")
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + file.originalname + '-' + Date.now())
    }
})
// Create multer instance
const upload = multer({ storage: storage }).single('image')


// @desc    Show create page
// @route   GET /news/create
router.get('/create', ensureAuth, (req, res) => {
    res.render('news/create')
})


// @desc    Process create news form
// @route   POST /news
router.post('/', ensureAuth, upload, async (req, res) => {
    try {
        req.body.user = req.user.id
        if (req.file) {
            req.body.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            }
        }
        await News.create(req.body)
        res.redirect('/news')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})


// @desc    Show all news
// @route   GET /news
router.get('/', ensureAuth, async (req, res) => {
    try {
        const news = await News.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 1 })
            .lean()

        res.render('news/index', {
            news,
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

// @desc    Show single news
// @route   GET /news/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let news = await News.findById(req.params.id)
            .populate('user')
            .lean()

        if (!news) {
            return res.render('error/404')
        }

        if (news.user._id != req.user.id && news.status == 'private') {
            res.render('error/404')
        } else {
            res.render('news/show', {
                news,
            })
        }
    } catch (err) {
        console.error(err)
        res.render('error/404')
    }
})

// @desc    Show edit page
// @route   GET /news/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const news = await News.findOne({
            _id: req.params.id,
        }).lean()

        if (!news) {
            return res.render('error/404')
        }

        if (news.user != req.user.id) {
            res.redirect('/news')
        } else {
            res.render('news/edit', {
                news,
            })
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

// @desc    Update news
// @route   PUT /news/:id
router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let news = await News.findById(req.params.id).lean()

        if (!news) {
            return res.render('error/404')
        }

        if (news.user != req.user.id) {
            res.redirect('/news')
        } else {
            news = await News.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true,
            })

            res.redirect('/newspage')
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

// @desc    Delete news
// @route   DELETE /news/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        let news = await News.findById(req.params.id).lean()

        if (!news) {
            return res.render('error/404')
        }

        if (news.user != req.user.id) {
            res.redirect('/newspage')
        } else {
            await News.deleteOne({ _id: req.params.id })
            res.redirect('/newspage')
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

// @desc    User nwes
// @route   GET /news/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        const news = await News.find({
            user: req.params.userId,
            status: 'public',
        })
            .populate('user')
            .lean()

        res.render('news/index', {
            news,
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

//@desc Search news by title
//@route GET /news/search/:query
router.get('/search/:query', ensureAuth, async (req, res) => {
    try {
        const news = await News.find({ title: new RegExp(req.query.query, 'i'), status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()
        res.render('news/index', { news })
    } catch (err) {
        console.log(err)
        res.render('error/404')
    }
})


module.exports = router
