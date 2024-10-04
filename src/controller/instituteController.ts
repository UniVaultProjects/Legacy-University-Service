/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response, NextFunction } from 'express';
import httpResponse from '../utils/httpResponse';
import responseMessage from '../constant/responseMessage';
import httpError from '../utils/httpError';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';

const prisma = new PrismaClient();

// Structure for data
interface InstitutePost {
  name: string;
  short_name: string;
  desc: string;
  order_no: number;
}

// Validation schema for incoming data
const schema = Joi.object({
  name: Joi.string().min(3).max(75).required(),
  short_name: Joi.string().required(),
  desc: Joi.string().required(),
  order_no: Joi.number().integer().required()
});

export default {
  InstitutePost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate Request Body
      const { error, value } = schema.validate(req.body);
      
      // Validation Error
      if (error) {
        return httpResponse(req, res, 400, error.message);
      }
      const postData: InstitutePost = value as InstitutePost;
      
      // Here you would typically save `post` to the database
      // await Institute Create(post);
      const post = await prisma.institute.create({
        data: postData
      });
      
      // Send a success response
      httpResponse(req, res, 200, responseMessage.SUCCESS, post);
    } catch (error) {
      httpError(next, error, req, 500);
    }
  },
};
