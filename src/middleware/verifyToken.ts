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
      const verifyToken = await axios.post(
        'http://localhost:3000/v1/isvalidtoken',
        {
          token,
        },
        {
          // Ensure cookies are send with the request.
          withCredentials: true,
        }
      );
      // If verification fails, Backend 1 will send a 401 or other error
      if (verifyToken.status !== 200) {
        res.status(401).json({ error: 'Invalid token' });
      }
      console.log(verifyToken.data);
      next();
    } catch (error) {
      throw error;
    }
  },
};
