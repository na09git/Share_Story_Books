// routes/news.js
const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const isAdmin = require('../middleware/isAdmin');

// GET request for displaying a list of all news
router.get('/', newsController.newsList);

// GET request for creating a new news
router.get('/create', isAdmin, newsController.newsCreateGet);

// POST request for creating a new news
router.post('/', isAdmin, newsController.newsCreatePost);

// GET request for editing a news
router.get('/edit/:id', isAdmin, newsController.newsEditGet);

// PUT request for editing a news
router.put('/:id', isAdmin, newsController.newsEditPut);

// DELETE request for deleting a news
router.delete('/:id', isAdmin, newsController.newsDelete);

module.exports = router;
