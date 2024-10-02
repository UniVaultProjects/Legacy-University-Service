import express , { Application } from 'express';
import router from './router/router';
import globalErrorHandler from './middleware/globalErrorHandler';

const app : Application = express()

// Middleware
app.use(express.json())

// Router
app.use('/api/v1',router)

app.use(globalErrorHandler)

export default app