const passport = require('passport');
const {User} = require('../models/DBModels');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },

    async (email, password, done) => {
        try {
            const user = await User.findOne({email:email});
            if(!user){
                return done(null, false,{ message: 'incorect email or user'})
            }
            if (user.password !== password){
                return done(null, false, {message: 'incorrect password'})
            }
            return done(null, user);
        }catch(error){
            return done(error);
        }
    }
));

passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser(async (id,done)=>{
    try {
        const user = await User.findById(id);
        console.log('Deserialized user:', user);
        done(null,user);
    }catch(error){
        done(error);
    }
});

module.exports = passport;
