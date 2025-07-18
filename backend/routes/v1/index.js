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

const { Skill } = require('../../models/DBModels'); //for creating new skill listing



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



// Create Skill Listing
router.post('/api/skills', isAuthenticated, async (req, res) => {
  try {
    const { title, category, description, exchangeSkills } = req.body;
    const skill = new Skill({
      title,
      category,
      description,
      owner_id: req.user._id,
      exchangeSkills
    });
    await skill.save();
    res.status(201).json({ message: 'Skill created', skill });
  } catch (err) {
    res.status(500).json({ message: 'Error creating skill' });
  }
});
// Get skill details page
router.get('/api/skills/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id).populate('owner_id', 'email');
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json(skill);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching skill' });
  }
});

// Protected API routes testing
router.get('/api/protectedData', isAuthenticated, (req, res) => {
    res.json({ 
        message: 'This is protected data',
        user: req.user.email 
    });
});

router.get('/api/skills', async (req, res) => {
  try {
    const skills = await Skill.find().populate('owner_id', 'name email');
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching skills' });
  }
});


module.exports = router;



