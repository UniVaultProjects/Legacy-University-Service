/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Request, Response, NextFunction } from 'express'
import httpResponse from '../../utils/httpResponse'
import httpError from '../../utils/httpError'
import responseMessage from '../../constant/responseMessage'
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

interface GetInstituteRequestBody {
    id: string[]
}

interface PostInstituteRequestBody {
    name: string
    short_name: string
    desc: string
    order_no: number
}

interface DeleteInstituteRequestBody {
    id: string
}

export default {
    /**
   * @Route: GET /institute
    Export an object with login method for user authentication.
    Here AuthComm is passing a req.ops object that contains
    various metadata such as institute id's and operations allowed.
    only allowed operation [GET] and allowed institutes can be accesed.
   **/

    InstituteGet: async (req: Request<{}, {}, GetInstituteRequestBody>, res: Response, next: NextFunction) => {
        try {
            // finds all the data in Institute
            // can only view that institue for which permission has been granted.
            //  const grantedPermissions = req.ops
            // destructuring req.body.id

            const allowedInstitutes: string[] = req.InstituteIds as string[]

            const get = await prisma.institute.findMany({
                where: {
                    id: {
                        in: allowedInstitutes
                    }
                }
            })

            // Success Response.
            return httpResponse(req, res, 200, responseMessage.SUCCESS, get)
        } catch (error) {
            httpError(next, error, req, 500)
        }
    },

    // Create institute
    InstitutePost: async (req: Request<{}, {}, NonNullable<PostInstituteRequestBody>>, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Here you would typically save `post` to the database
            // await Institute Create(post);

            const { name, short_name, desc, order_no } = req.body

            // Validate input values
            if (!name || !short_name || !desc || order_no === undefined) {
                res.status(400).json({ error: 'All fields are required' })
                return
            }

            // Prepare the institute data
            const instituteData = {
                name, // Using the destructured variable
                short_name, // Using the destructured variable
                desc, // Using the destructured variable
                order_no // Using the destructured variable
            }

            const post = await prisma.institute.create({
                data: instituteData
            })

            // Send a success response
            httpResponse(req, res, 200, responseMessage.SUCCESS, post)
        } catch (error) {
            httpError(next, error, req, 500)
        }
    },

    // Delete institute
    InstituteDelete: async (req: Request<{}, {}, DeleteInstituteRequestBody>, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Here we will delete the object using objectID
            // await Institute delete(id);
            const { id } = req.body

            if (!id || typeof id !== 'string') {
                res.status(400).json({ error: 'institute ID is required' })
                return
            }

            // Find Object by id .
            const deletedInstitute = await prisma.institute.delete({
                where: { id: id } // Specify Objectid and where condition.
            })

            if (!deletedInstitute) {
                res.status(400).json({ error: 'institute not found' })
                return
            }

            // Send a success response & deleted record.
            httpResponse(req, res, 200, responseMessage.SUCCESS, deletedInstitute)
        } catch (error) {
            // If the record is not found, Prisma throws an error
            // Type assertion for error
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    // Record not found error
                    res.status(400).json({ error: 'institute not found' })
                    return
                }
            }
            httpError(next, error, req, 500)
        }
    }
}

