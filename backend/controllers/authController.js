const {User} = require('../models/DBModels');

// Register function
const registerFunction = async (req, res) => {
    try {
        const { name, password, email } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [ { email }] 
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                message: 'or email already exists' 
            });
        }
        
        // Create new user
        const user = new User({
            name,
            password, 
            email
        });
        
        await user.save();
        
        // Log the user in after registration
        req.login(user, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error logging in after registration' });
            }
            res.status(201).json({ 
                message: 'Registration successful',
                user: {
                    id: user._id,
                    email: user.email
                }
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user' });
    }
};

// Login function
const loginFunction = (req, res) => {
    console.log('User logged in successfully');
    console.log('Session ID:', req.sessionID);
    res.json({
        message: 'Login successful',
        user: {
            id: req.user._id,
            email: req.user.email
        }
    });
};

// Logout function
const logoutFunction = (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error logging out' });
        }
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: 'Error destroy session' });
            }
            res.clearCookie('sessionID');
            res.json({ message: 'Logout successful' });
        });
        
    });
};

// Get current user function


// Render login page function
const renderLoginPage = (req, res) => {
    res.render('login',{
        error: req.query.error,
        expired: req.query.expired === 'true'
    });
};

// Render home page function
const renderHomePage = (req, res) => {
    res.render('index', { user: req.user });
};

// Check session status
const checkSessionStatus = (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            authenticated: true,
            user: {
                id: req.user._id,
                email: req.user.email,
                name: req.user.name
            },
            sessionExpires: req.session.cookie.expires
        });
    } else {
        res.json({
            authenticated: false,
            message: 'Not authenticated'
        });
    }
};

module.exports = {
    registerFunction,
    loginFunction,
    logoutFunction,
    renderLoginPage,
    renderHomePage,
    checkSessionStatus
}; 