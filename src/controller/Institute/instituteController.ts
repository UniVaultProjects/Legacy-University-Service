/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response, NextFunction } from 'express';
import httpResponse from '../../utils/httpResponse';
import responseMessage from '../../constant/responseMessage';
import httpError from '../../utils/httpError';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default {
  // Get all institutes 
  InstituteGet: async (req: Request, res: Response) => {
    try {
      // finds all the data in Institute
      // can only view that institue for which permission has been granted.
      const data = await prisma.institute.findMany({});
      return httpResponse(req, res, 200, responseMessage.SUCCESS, data);
    } catch (error) {
      throw error;
    }
  },

  // Create institute
  InstitutePost: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Here you would typically save `post` to the database
      // await Institute Create(post);
      const post = await prisma.institute.create({
        data: req.body
      });

      // Send a success response
      httpResponse(req, res, 200, responseMessage.SUCCESS, post);
    } catch (error) {
      httpError(next, error, req, 500);
    }
  }
};
