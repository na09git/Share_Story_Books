const express = require('express')
const passport = require('passport')
const router = express.Router()


// @route   GET /home
router.get('/home', (req, res) => {
  try {
    res.render('home')
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})



module.exports = router