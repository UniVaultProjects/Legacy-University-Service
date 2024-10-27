/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import config from '../config/config';

export default {
  verifyToken: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const authHeader = req.headers['authorization'];

      if (!authHeader) {
        res.status(401).json({ error: 'Unauthorized ' });
        return;
      }
      const token = authHeader.split(' ')[1];

      // Using axios to send a post request to our Authentication service
      // to verify the provided token and ensure permissions & security .
      // Authentication Service URL for endpoint.
      const url: string = config.AUTH_URL;

      // Make the POST request with withCredentials enabled and cookies sent
      const sendToken = await axios.post(
        url,
        {
          method: req.method,
          action: 'NA',
          entity: 'NOTES_SERVICE',
          token
        },
        {
          withCredentials: true
        }
      );

      // If verification fails, Backend 1 will send a 401 or other error
      if (sendToken.status !== 200) {
        res.status(401).json({ error: 'Invalid token' });
      }

      // Accessing Token Payload , specifically Institute permissions.
      const permissions = sendToken.data.data.permissions;

      // Accessing Institute array containing
      // Institute id's and allow permissions.
      const allowedOperations = permissions.institutes;

      // Accessing Institute array containing
      // It contains Either ? ADMIN : MANAGER.
      const userType = sendToken.data.data;

      // Adding allowedOperations value to request object.
      req.ops = allowedOperations;

      // Adding user to request object.
      req.user = userType;

      // Control over to next middleware or Controller.
      next();
    } catch (error) {
      throw error;
    }
  }
};
