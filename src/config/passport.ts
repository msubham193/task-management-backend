import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: 'http://localhost:5000/api/auth/google/callback'
}, async (token, tokenSecret, profile, done) => {
    try {
        console.log('Profile:', profile); // Log the profile for debugging
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            user = new User({
                name: profile.displayName,
                email: profile.emails ? profile.emails[0].value : '',
                googleId: profile.id
            });

            await user.save();
        }

        // Generate JWT token
        const payload = {
            user: {
                id: user.id,
            },
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

        // Pass the user and token separately
        return done(null, { user, token });
    } catch (err) {
        console.error('Error in Google Strategy:', err); // Log the error for debugging
        return done(err, null);
    }
}));

export default passport;
