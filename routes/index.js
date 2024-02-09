const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const Story = require('../models/Story')
const News = require('../models/News')
const Student = require('../models/Student')
const Problem = require('../models/Problem')
const Worker = require('../models/Worker')



// @desc    Login/Landing page
// @route   GET /
router.get('/login', ensureGuest, (req, res) => {
  res.render('login', {
    layout: 'login',
  })
})


// @desc    stories
// @route   GET /stories
router.get('/stories', ensureAuth, async (req, res) => {
  try {
    const story = await Story.find({ user: req.user.id }).lean()
    res.render('stories', {
      name: req.user.firstName,
      story,
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


// @desc    Student
// @route   GET /student
router.get('/students', ensureAuth, async (req, res) => {
  try {
    const student = await Student.find({ user: req.user.id }).lean()
    res.render('students', {
      name: req.user.firstName,
      student,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})


// @desc    Worker
// @route   GET /worker
router.get('/workers', ensureAuth, async (req, res) => {
  try {
    const worker = await Worker.find({ user: req.user.id }).lean()
    res.render('workers', {
      name: req.user.firstName,
      worker,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})


// @desc    Problem
// @route   GET /problem
router.get('/problems', ensureAuth, async (req, res) => {
  try {
    const problem = await Problem.find({ user: req.user.id }).lean()
    res.render('problems', {
      name: req.user.firstName,
      problem,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})


// @desc    amirdetail
// @route   GET /amirdetail
router.get('/amirmessage', (req, res) => {
  try {
    res.render('amirmessage')
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})


// @desc    vission-and-mission
// @route   GET /vission-and-mission
router.get('/vission-and-mission', (req, res) => {
  try {
    res.render('vission-and-mission')
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})
module.exports = router