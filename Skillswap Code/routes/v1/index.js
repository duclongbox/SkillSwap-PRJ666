const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isAuthenticated, isNotAuthenticated , handleSessionExpiry} = require('../../middleware/auth');
const { 
    registerFunction, 
    loginFunction, 
    logoutFunction, 
    renderLoginPage,
    renderHomePage,
    checkSessionStatus
} = require('../../controllers/authController');
const { getCurrentUserFunction } = require('../../controllers/userController');


// Render routes
router.get('/', renderHomePage);
router.get('/login', isNotAuthenticated, renderLoginPage);

// Authentication routes
router.post('/api/register', isNotAuthenticated, registerFunction);
router.post('/api/login', isNotAuthenticated, passport.authenticate('local'), loginFunction);
router.post('/api/logout', isAuthenticated, logoutFunction);
router.get('/api/me', isAuthenticated, getCurrentUserFunction);
router.get('/api/session-status', checkSessionStatus);


// Protected API routes example
router.get('/api/protectedData', isAuthenticated, (req, res) => {
    res.json({ 
        message: 'This is protected data',
        user: req.user.email 
    });
});


module.exports = router;



