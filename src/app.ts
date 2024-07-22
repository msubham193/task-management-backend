import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import errorHandler from './utils/errorHandler';
import passport  from "./config/passport"
import session from 'express-session';

dotenv.config();

// Connect to the database
connectDB();

const app: Application = express();

app.use(cors({
    origin: 'https://task-management-b892.vercel.app',
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
       next();
 });
// Middlewares



app.use(express.json()); // Body parser
app.use(morgan('dev')); // Logger
app.use(helmet()); // Security
 // Enable CORS

// Express session
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));




// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Route middlewares
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);




// Health check route
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK' });
});

// Error handler middleware
app.use(errorHandler);

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ error: 'Not Found' });
});

export default app;
