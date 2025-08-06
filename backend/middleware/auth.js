// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    // for api requests
    if (req.path.startsWith('/api/')) {
        return res.status(401).json({ 
            message: 'Please log in to access this resource',
            code: 'UNAUTHORIZED'
        });
    }
    return res.json({message:"is not thenticate"});
};

// Middleware to check if user is NOT authenticated
const isNotAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    // For API requests, return JSON error
    if (req.path.startsWith('/api/')) {
        return res.status(400).json({ 
            message: 'You are already logged in',
            code: 'ALREADY_AUTHENTICATED'
        });
    }
    
    // For web requests, redirect to home
    res.redirect('/');
};
// Middleware to handle session expiry
const handleSessionExpiry = (req, res, next) => {
    if (req.session && req.session.cookie.expires) {
        const now = new Date();
        const expires = new Date(req.session.cookie.expires);
        
        if (now > expires) {
            req.logout((err) => {
                if (err) {
                    console.error('Error during logout:', err);
                }
                if (req.path.startsWith('/api/')) {
                    return res.status(401).json({ 
                        message: 'Session expired. Please log in again.',
                        code: 'SESSION_EXPIRED'
                    });
                }
                
                res.redirect('/login?expired=true');
            });
            return;
        }
    }
    next();
};

const { Skill } = require('../models/DBModels');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user?.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
};

// Middleware to check if user is skill owner or admin
const isSkillOwnerOrAdmin = async (req, res, next) => {
    try {
        const skill = await Skill.findById(req.params.id);
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        const isOwner = skill.owner_id.toString() === req.user._id.toString();
        const isAdminUser = req.user.role === 'admin';

        if (!isOwner && !isAdminUser) {
            return res.status(403).json({ message: 'Forbidden: Not allowed to modify this skill' });
        }

        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
    isAuthenticated,
    isNotAuthenticated,
    handleSessionExpiry,
    isAdmin,
    isSkillOwnerOrAdmin
};