import { Request, Response, NextFunction } from 'express'
import axios, { HttpStatusCode } from 'axios'
import config from '../config/config'
import { AuthServiceResponse } from '../types/AuthServiceResponse'
import { UserDetail } from '../types/userDetails'

export default {
    verifyToken: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Header check
            const authHeader = req.headers['authorization']
            if (!authHeader) {
                res.status(401).json({ error: 'Unauthorized ' }) // #TODO: Add Error Object
                return
            }
            // Extract token
            const authWithBearer = authHeader.split(' ')
            if (authWithBearer.length < 2) {
                res.status(HttpStatusCode.BadRequest).json({ error: 'Unauthorized ' }) // #TODO: Add Error Object
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
            // TODO: Handle error
            throw error
        }
    }
}
