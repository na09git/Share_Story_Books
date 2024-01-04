const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const Story = require('../models/Story')
const News = require('../models/News')
const Student = require('../models/Student')



// @desc    Login/Landing page
// @route   GET /
router.get('/login', ensureGuest, (req, res) => {
  res.render('login', {
    layout: 'login',
  })
})


// @desc    Dashboard
// @route   GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user.id }).lean()
    res.render('dashboard', {
      name: req.user.firstName,
      stories,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    News
// @route   GET /news
router.get('/newspage', ensureAuth, async (req, res) => {
  try {
    const news = await News.find({ user: req.user.id }).lean()
    res.render('newspage', {
      name: req.user.firstName,
      news,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

router.get('/home', (req, res) => {
  try {
    res.render('home')
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})


// @desc    contact
// @route   GET /contact
router.get('/contact', (req, res) => {
  try {
    res.render('contact')
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})


// @desc    News
// @route   GET /news
router.get('/student', ensureAuth, async (req, res) => {
  try {
    const student = await Student.find({ user: req.user.id }).lean()
    res.render('student', {
      name: req.user.firstName,
      student,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})


// @desc    amirdetail
// @route   GET /amirdetail
router.get('/amirdetail', (req, res) => {
  try {
    res.render('amirdetail')
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})


module.exports = router
