/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response, NextFunction } from 'express';
import httpResponse from '../utils/httpResponse';
import responseMessage from '../constant/responseMessage';
import httpError from '../utils/httpError';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';

const prisma = new PrismaClient();

// Structure for data
interface instituteInterface {
  name: string;
  short_name: string;
  desc: string;
  order_no: number;
}

export default {
  // eslint-disable-next-line @typescript-eslint/require-await
  testGet: async (_: Request, res: Response) => {
    try {
      res.status(200).json('Welcome to Institute Service');
    } catch (error) {
      throw error;
    }
  },

  
  InstituteGet: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = Joi.object({
        id: Joi.string().required(),
      });

      //eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id } = req.body;
      const { error, value } = schema.validate(req.body);

      //eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const getData: string = value.id;

      if (error) {
        return httpError(next, error, req, 500);
      }
      const get = await prisma.institute.findUnique({
        where: {
          id: getData,
        },
      });

      if (!get) {
        return httpError(next, error, req, 404);
      }
      return httpResponse(req, res, 200, responseMessage.SUCCESS);
    } catch (error) {
      throw error;
    }
  },

  InstitutePost: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Validation schema for incoming data
      const schema = Joi.object({
        name: Joi.string().min(3).max(75).required(),
        short_name: Joi.string().required(),
        desc: Joi.string().required(),
        order_no: Joi.number().integer().required(),
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { name, short_name, desc, order_no } = req.body;
      const { error, value } = schema.validate(req.body);

      // Validation Error
      if (error) {
        return httpResponse(req, res, 400, error.message);
      }
      const postData: instituteInterface = value as instituteInterface;

      // Here you would typically save `post` to the database
      // await Institute Create(post);
      const post = await prisma.institute.create({
        data: postData,
      });

      // Send a success response
      httpResponse(req, res, 200, responseMessage.SUCCESS, post);
    } catch (error) {
      httpError(next, error, req, 500);
    }
  },
};
