import express, { Express } from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import authRoutes from './routes/auth.route';
import errorHandler from './middlewares/error.middleware';
import studyPlanRoutes from './routes/studyPlans.route';
import aiPlanRoute from './routes/aiPlan.route';
import app from "./app";
import axios from 'axios';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
const cron = require('node-cron');
import quizRoutes from './routes/quiz.route';



const PORT = process.env.PORT || 3000;



// Middleware
app.use(express.json());

// Database connection
// Middleware
app.use(express.json());

// Database connection
connectDB();

// Routes
app.get('/', (req, res) => {
  res.send('Express app running on Render!');
});


// Health check endpoint for pinging
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Self-pinging function
const startPinging = () => {
  // Use the Render-provided URL or fallback to localhost for development
  const appUrl = process.env.APP_URL || process.env.RENDER_EXTERNAL_URL|| `http://localhost:${PORT}`;
  
  // Schedule ping every 10 seconds
  cron.schedule('*/10 * * * *', async () => {
    try {
      const response = await axios.get(`${appUrl}/health`);
      console.log(`Ping successful at ${new Date().toISOString()}: ${response.status}`);
    } catch (error:any) {
      console.error(`Ping failed at ${new Date().toISOString()}: ${error.message}`);
    }
  });
};
app.use('/api/auth', authRoutes);

// The study Plan routes
app.use('/api', studyPlanRoutes);
app.use('/api/ai', aiPlanRoute);

// The quiz Route
app.use('/api/quiz', quizRoutes);


// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handling
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📚 API Documentation available at: ${PORT}/api-docs`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
