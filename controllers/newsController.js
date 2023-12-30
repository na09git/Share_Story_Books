// controllers/newsController.js

const News = require('../models/News');

// Display a list of all news
exports.newsList = async (req, res) => {
    try {
        const news = await News.find();
        res.render('news/index', { news, isAdmin: req.user.isAdmin });
    } catch (err) {
        console.error(err);
        res.render('error', { message: 'Error fetching news' });
    }
};

// Display the form to create a new news
exports.newsCreateGet = (req, res) => {
    res.render('news/create');
};

// Handle creating a new news
exports.newsCreatePost = async (req, res) => {
    // Check if user is an admin
    if (!req.user.isAdmin) {
        return res.render('error', { message: 'Unauthorized' });
    }

    // Code to handle creating news (save to the database, etc.)
    // ...

    res.redirect('/news');
};

// Display the form to edit a news
exports.newsEditGet = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        res.render('news/edit', { news });
    } catch (err) {
        console.error(err);
        res.render('error', { message: 'Error fetching news' });
    }
};

// Handle editing a news
exports.newsEditPut = async (req, res) => {
    // Check if user is an admin
    if (!req.user.isAdmin) {
        return res.render('error', { message: 'Unauthorized' });
    }

    // Code to handle editing news (update in the database, etc.)
    // ...

    res.redirect('/news');
};

// Handle deleting a news
exports.newsDelete = async (req, res) => {
    // Check if user is an admin
    if (!req.user.isAdmin) {
        return res.render('error', { message: 'Unauthorized' });
    }

    // Code to handle deleting news (remove from the database, etc.)
    // ...

    res.redirect('/news');
};

