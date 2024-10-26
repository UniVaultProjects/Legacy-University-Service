import express, { Application } from 'express';
import routes from './router/institute.router'
import globalErrorHandler from './middleware/globalErrorHandler';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app: Application = express();

// Middleware
// Use cookie-parser middleware to parse cookies

app.use(cookieParser());
app.use(
  cors({
    // Auth Action Service on Port 3000
    origin: '*', // Allow requests from the other backend
    credentials: true // Allow cookies to be sent with requests
  })
);
app.use(express.json());


// Router
app.use('/api', routes);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
