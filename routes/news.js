// routes/news.js
const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const multer = require('multer');

const Story = require('../models/News')


// image Upload // Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads")
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + file.originalname + '-' + Date.now())
    }
})
// Create multer instance
const upload = multer({ storage: storage }).single('image')


// @desc    Show Create page
// @route   GET /news/create
router.get('/create', (req, res) => {
    res.render('news/create')
})


// @desc    Process create form
// @route   POST /news
router.post('/', upload, async (req, res) => {
    try {
        if (req.file) {
            req.body.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        }

        News.create(req.body);
        res.redirect('/news');
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

// // @desc    Show all stories
// // @route   GET /stories
// router.get('/', ensureAuth, async (req, res) => {
//     try {
//         const stories = await Story.find({ status: 'public' })
//             .populate('user')
//             .sort({ createdAt: 1 })
//             .lean()

//         res.render('stories/index', {
//             stories,
//         })
//     } catch (err) {
//         console.error(err)
//         res.render('error/500')
//     }
// })

// // @desc    Show single story
// // @route   GET /stories/:id
// router.get('/:id', ensureAuth, async (req, res) => {
//     try {
//         let story = await Story.findById(req.params.id)
//             .populate('user')
//             .lean()

//         if (!story) {
//             return res.render('error/404')
//         }

//         if (story.user._id != req.user.id && story.status == 'private') {
//             res.render('error/404')
//         } else {
//             res.render('stories/show', {
//                 story,
//             })
//         }
//     } catch (err) {
//         console.error(err)
//         res.render('error/404')
//     }
// })

// // @desc    Show edit page
// // @route   GET /stories/edit/:id
// router.get('/edit/:id', ensureAuth, async (req, res) => {
//     try {
//         const story = await Story.findOne({
//             _id: req.params.id,
//         }).lean()

//         if (!story) {
//             return res.render('error/404')
//         }

//         if (story.user != req.user.id) {
//             res.redirect('/stories')
//         } else {
//             res.render('stories/edit', {
//                 story,
//             })
//         }
//     } catch (err) {
//         console.error(err)
//         return res.render('error/500')
//     }
// })

// // @desc    Update story
// // @route   PUT /stories/:id
// router.put('/:id', ensureAuth, async (req, res) => {
//     try {
//         let story = await Story.findById(req.params.id).lean()

//         if (!story) {
//             return res.render('error/404')
//         }

//         if (story.user != req.user.id) {
//             res.redirect('/stories')
//         } else {
//             story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
//                 new: true,
//                 runValidators: true,
//             })

//             res.redirect('/dashboard')
//         }
//     } catch (err) {
//         console.error(err)
//         return res.render('error/500')
//     }
// })

// // @desc    Delete story
// // @route   DELETE /stories/:id
// router.delete('/:id', ensureAuth, async (req, res) => {
//     try {
//         let story = await Story.findById(req.params.id).lean()

//         if (!story) {
//             return res.render('error/404')
//         }

//         if (story.user != req.user.id) {
//             res.redirect('/stories')
//         } else {
//             await Story.deleteOne({ _id: req.params.id })
//             res.redirect('/dashboard')
//         }
//     } catch (err) {
//         console.error(err)
//         return res.render('error/500')
//     }
// })

// // @desc    User stories
// // @route   GET /stories/user/:userId
// router.get('/user/:userId', ensureAuth, async (req, res) => {
//     try {
//         const stories = await Story.find({
//             user: req.params.userId,
//             status: 'public',
//         })
//             .populate('user')
//             .lean()

//         res.render('stories/index', {
//             stories,
//         })
//     } catch (err) {
//         console.error(err)
//         res.render('error/500')
//     }
// })

// //@desc Search stories by title
// //@route GET /stories/search/:query
// router.get('/search/:query', ensureAuth, async (req, res) => {
//     try {
//         const stories = await Story.find({ title: new RegExp(req.query.query, 'i'), status: 'public' })
//             .populate('user')
//             .sort({ createdAt: 'desc' })
//             .lean()
//         res.render('stories/index', { stories })
//     } catch (err) {
//         console.log(err)
//         res.render('error/404')
//     }
// })


module.exports = router;
