import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';
const bcrypt = require('bcryptjs');

exports.register = async (req:Request, res:Response) => {
    try {
      const { name, email, password } = req.body;
  
      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Create new user
      user = new User({
        name,
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
        { expiresIn: '1h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error:any) {
        res.status(400).json({ error: error.message });
    }
};
