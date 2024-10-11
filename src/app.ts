import express, { Application } from 'express';
import router from './router/router';
import globalErrorHandler from './middleware/globalErrorHandler';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app: Application = express();

// Middleware
// Use cookie-parser middleware to parse cookies
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    // Auth Action Service on Port 3000
    origin: 'http://localhost:3000', // Allow requests from the other backend
    credentials: true, // Allow cookies to be sent with requests
  })
);
// Router
app.use('/api', router);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
