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

// Import user routes
const userRoutes = require('./userRoutes');

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

// Mount user routes
router.use('/api/users', userRoutes);

// User Connection Routes
router.post('/:recipientID/sendRequest',isAuthenticated,sendConnection );
router.post('/:connectionID/accept',isAuthenticated, acceptRequest);
router.post('/:connectionID/decline',isAuthenticated, declineRequest);
router.get('/requests',isAuthenticated, listRequest);
router.get('/connections',isAuthenticated, listConnections);



// Create Skill Listing
router.post('/api/skills', isAuthenticated, async (req, res) => {
  try {
    const { 
      title, 
      category, 
      description, 
      exchangeSkills, 
      skillLevel, 
      availability, 
      duration 
    } = req.body;

    // Validation
    if (!title || !category || !description || !exchangeSkills) {
      return res.status(400).json({ 
        message: 'Title, category, description, and exchange skills are required' 
      });
    }

    if (title.length < 3) {
      return res.status(400).json({ 
        message: 'Title must be at least 3 characters long' 
      });
    }

    if (description.length < 20) {
      return res.status(400).json({ 
        message: 'Description must be at least 20 characters long' 
      });
    }

    const skill = new Skill({
      title: title.trim(),
      category,
      description: description.trim(),
      owner_id: req.user._id,
      exchangeSkills: Array.isArray(exchangeSkills) ? exchangeSkills : [exchangeSkills],
      skillLevel: skillLevel || 'Beginner',
      availability: availability || 'Flexible',
      duration: duration || '1-2 hours'
    });

    await skill.save();
    
    // Populate owner info for response
    await skill.populate('owner_id', 'name email');
    
    res.status(201).json({ 
      message: 'Skill created successfully', 
      skill 
    });
  } catch (err) {
    console.error('Error creating skill:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error: ' + Object.values(err.errors).map(e => e.message).join(', ')
      });
    }
    res.status(500).json({ message: 'Error creating skill' });
  }
}); // Get skill details page
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



