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
const {
    sendConnection,
    acceptRequest,
    declineRequest,
    listConnections,
    listRequest
} = require('../../controllers/connectionController')
const { getAllSkills } = require('../../controllers/skillController');
const path = require('path');

// Render routes
router.get('/', renderHomePage);
router.get('/login', isNotAuthenticated, renderLoginPage);

// Authentication routes
router.post('/api/register', isNotAuthenticated, registerFunction);
router.post('/api/login', isNotAuthenticated, passport.authenticate('local'), loginFunction);
router.post('/api/logout', isAuthenticated, logoutFunction);
router.get('/api/me', isAuthenticated, getCurrentUserFunction);
router.get('/api/session-status', checkSessionStatus);


// User Connection Routes
router.post('/:recipientID/sendRequest',isAuthenticated,sendConnection );
router.post('/:connectionID/accept',isAuthenticated, acceptRequest);
router.post('/:connectionID/decline',isAuthenticated, declineRequest);
router.get('/requests',isAuthenticated, listRequest);
router.get('/connections',isAuthenticated, listConnections);





// Protected API routes testing
router.get('/api/protectedData', isAuthenticated, (req, res) => {
    res.json({ 
        message: 'This is protected data',
        user: req.user.email 
    });
});


//Skill Route
router.get('/skills', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/skills.html'));
});

router.get('/api/skills', getAllSkills);


module.exports = router;



