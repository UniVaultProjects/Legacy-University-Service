import express , { Application } from 'express';
import router from './router/router';
import globalErrorHandler from './middleware/globalErrorHandler';

const app : Application = express()

// Middleware
app.use(express.json())

// Router
app.use('/api',router)

// Global Error Handler
app.use(globalErrorHandler)

export default app