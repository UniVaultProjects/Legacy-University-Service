/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Request, Response, NextFunction } from 'express';
import httpResponse from '../../utils/httpResponse';
import responseMessage from '../../constant/responseMessage';
import httpError from '../../utils/httpError';
import { PrismaClient, Prisma } from '@prisma/client';


const prisma = new PrismaClient();


export default {
  /**
   * @Route: GET /institute
   * Export an object with login method for user authentication.
   * Here AuthComm is passing a req.ops object that contains
   * various metadata such as institute id's and operations allowed.
   * only allowed operation [GET] and allowed institutes can be accesed.
   **/

  InstituteGet: async (req: Request, res: Response, next: NextFunction) => {
    try {

         // finds all the data in Institute
      // can only view that institue for which permission has been granted.

      const grantedPermissions = req.ops;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
      const ids : string[] = grantedPermissions.map((items: any) => items.id);

      // only finding allowed institutes.
      const data = await prisma.institute.findMany({
        where: {
          id: {
            in: ids
          }
        }
      });

      
      // Success Response.
      return httpResponse(req, res, 200, responseMessage.SUCCESS,data);
    } catch (error) {
      httpError(next, error, req, 500);
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
  },

  // Delete institute
  InstituteDelete: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Here we will delete the object using objectID
      // await Institute delete(id);
      const { id } = req.body;

      if (!id) {
        res.status(400).json({ error: 'institute ID is required' });
        return;
      }

      // Find Object by id .
      const deletedInstitute = await prisma.institute.delete({
        where: { id: id } // Specify Objectid and where condition.
      });

      if (!deletedInstitute) {
        res.status(400).json({ error: 'institute not found' });
        return;
      }

      // Send a success response & deleted record.
      httpResponse(req, res, 200, responseMessage.SUCCESS, deletedInstitute);
    } catch (error) {
      // If the record is not found, Prisma throws an error
      // Type assertion for error
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          // Record not found error
          res.status(400).json({ error: 'institute not found' });
          return;
        }
      }
      httpError(next, error, req, 500);
    }
  }
};
