import { Router } from 'express';
import { register, login } from '../controllers/authController';
import passport from '../config/passport';
import { IUser } from '../models/User';

const router = Router();




router.post('/register', register);
router.post('/login', login);

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication failed' });
    }

    // Type assertion with 'unknown' first
    const { user, token } = req.user as unknown as { user: IUser, token: string };

    // Return the JWT token to the client
    res.json({ token,user });
});

export default router;
