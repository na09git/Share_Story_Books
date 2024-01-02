const express = require('express')
const passport = require('passport')
const router = express.Router()

// @route   GET /contact
router.get('/student', (req, res) => {
    res.send("All Students")
    // try {
    //     res.render('contact')
    // } catch (err) {
    //     console.error(err)
    //     res.render('error/500')
    // }
})

module.exports = router