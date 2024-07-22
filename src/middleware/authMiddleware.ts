import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

import { IUser } from '../models/User';

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        console.log(token);
        if (!token) {
            res.status(401).json({ error: 'Not authorized' });
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        res.status(401).json({ error: 'Not authorized' });
    }
};
