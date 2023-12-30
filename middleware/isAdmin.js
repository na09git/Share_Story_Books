// middleware/isAdmin.js

module.exports = (req, res, next) => {
    // Check if user is an admin
    if (req.isAuthenticated() && req.user.isAdmin) {
        return next();
    }
    // If not an admin, redirect to a page or handle it as needed
    res.render('error', { message: 'Unauthorized' });
};
