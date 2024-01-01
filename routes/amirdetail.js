const express = require('express')
const passport = require('passport')
const router = express.Router()

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