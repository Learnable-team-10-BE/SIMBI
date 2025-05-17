import express, { Express } from 'express';
import cors from 'cors';
import { connectDB } from './config/database';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.route';

const app: Express = express();

// CORS configuration
app.use(cors({
  origin: '*',  // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

connectDB();

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes)

export default app;
