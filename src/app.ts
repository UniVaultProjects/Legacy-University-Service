import express, { Application } from 'express'
import routes from './router/index.router'
import globalErrorHandler from './middleware/globalErrorHandler'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import { UserDetail } from './types/userDetails'

const app: Application = express()

declare global {
    namespace Express {
        interface Request {
            user_details?: UserDetail; // Ensure this is the correct type
        }
    }
}

// Middleware
// Use cookie-parser middleware to parse cookies

// Configure session middleware
app.use(express.json())
app.use(cookieParser())

app.use(
    session({
        secret: 'your_secret_key', // Change this to a secure random string
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true, // Prevents client-side access to the cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 3600000 // 1 hour
        }
    })
)

app.use(
    cors({
        // Auth Action Service on Port 3000
        origin: '*', // Allow requests from the other backend
        credentials: true // Allow cookies to be sent with requests
    })
)

// Router
app.use('/api', routes)

// Global Error Handler
app.use(globalErrorHandler)

export default app
