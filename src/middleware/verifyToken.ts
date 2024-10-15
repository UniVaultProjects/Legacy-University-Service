/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

export default {
  verifyToken: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Get the required token from the request body.
      const token = req.cookies.token;

      // Using axios to send a post request to our Authentication service
      // to verify the provided token and ensure permissions & security .
      // Authentication Service URL for endpoint.
      const url = 'http://localhost:3000/auth/validate';

      // Make the POST request with withCredentials enabled and cookies sent
      const sendToken = await axios.post(
        url,
        {
          token: token
        },
        {
          withCredentials: true // Enable sending cookies with the request
        }
      );
      
      // If verification fails, Backend 1 will send a 401 or other error
      if (sendToken.status !== 200) {
        res.status(401).json({ error: 'Invalid token' });
      }
      next();
    } catch (error) {
      throw error;
    }
  }
};
