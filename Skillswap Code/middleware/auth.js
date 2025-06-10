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
    return res.redirect('/login');
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

module.exports = {
    isAuthenticated,
    isNotAuthenticated,
    handleSessionExpiry
};