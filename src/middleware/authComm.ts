import { Request, Response, NextFunction } from 'express'
import axios, { HttpStatusCode } from 'axios'
import config from '../config/config'
import { AuthServiceResponse } from '../types/AuthServiceResponse'
import { UserDetail } from '../types/userDetails'
import { HttpResponse } from '../types/httpTypes'

export default {
    verifyToken: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Header check
            const authHeader = req.headers['authorization']
            if (!authHeader) {
                const body: HttpResponse = {
                    code: HttpStatusCode.Unauthorized,
                    message: 'Unauthorized!',
                    data: {}
                }
                res.status(body.code).json(body)
                return
            }

            // Extract token
            const authWithBearer = authHeader.split(' ')
            if (authWithBearer.length < 2) {
                const body: HttpResponse = {
                    code: HttpStatusCode.BadRequest,
                    message: 'Unauthorized!',
                    data: {}
                }
                res.status(body.code).json(body)
                return
            }
            const token = authWithBearer[1]

            // Check token from authService
            const response = await axios.post<AuthServiceResponse<UserDetail>>(
                String(config.AUTH_URL),
                {
                    method: req.method,
                    action: 'NA',
                    entity: 'NOTES_SERVICE',
                    token
                },
                {
                    withCredentials: true
                }
            )

            // Add userDetails in request
            req.user_details = response.data.data

            // Control over to next middleware or Controller.
            next()
        } catch (error) {
            // Check for axios error
            if (axios.isAxiosError<AuthServiceResponse<unknown>>(error)) {
                let body: HttpResponse
                if (error.response) {
                    // Server responded with a status other than 2xx
                    body = {
                        code: error.response.data.code,
                        message: error.response.data.message,
                        data: {}
                    }
                } else if (error.request) {
                    // No response was received from the server
                    body = {
                        code: HttpStatusCode.InternalServerError,
                        message: 'Service Unavailable',
                        data: {}
                    }
                } else {
                    // Error setting up the request
                    body = {
                        code: HttpStatusCode.InternalServerError,
                        message: 'Internal Server Error',
                        data: {}
                    }
                }
                res.status(body.code).json(body)
            } else {
                // Handle non-Axios errors
                const body: HttpResponse = {
                    code: HttpStatusCode.InternalServerError,
                    message: 'Internal Server Error',
                    data: {}
                }
                res.status(body.code).json(body)
            }
        }
    }
}
