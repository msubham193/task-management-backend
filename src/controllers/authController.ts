import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
const bcrypt = require('bcryptjs');

export const register = async (req: Request, res: Response, next: Function) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
          return res.status(400).json({ error: 'User already exists' });
        }

        // Create new user
        user = new User({
            firstname,
            lastname,
            email,
            password,
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user to database
        await user.save();

        // Create and return JWT token
        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || "",
            { expiresIn: '8h' },
            (err, token) => {
                if (err) {
                    return next(err); // Pass the error to the error handler
                }
                res.status(201).json({ token, user });
            }
        );
    } catch (err: any) {
        next(err); // Pass the error to the error handler
    }
};

export const login = async (req: Request, res: Response, next: Function)=> {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {

           return res.status(400).json({ error: 'User does not exist' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '8h' });
        res.status(200).json({ token, user });
    } catch (error: any) {
        next(error); // Pass the error to the error handler
    }
};
