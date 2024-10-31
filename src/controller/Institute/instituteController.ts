/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Request, Response, NextFunction } from 'express'
import httpResponse from '../../utils/httpResponse'
import httpError from '../../utils/httpError'
import responseMessage from '../../constant/responseMessage'
import { PrismaClient, Prisma, Institute } from '@prisma/client'
import { UserType } from '../../enum/userType'
import { Allow } from '../../enum/permissionAllowed'

const prisma = new PrismaClient()

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

    InstituteGet: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user_details) {
                throw new Error('Something went wrong!')
            }

            let institutes: Institute[] = []
            if (req.user_details.user_type == UserType.admin) {
                // For admin
                const response = await prisma.institute.findMany({})
                institutes = response
            } else if (req.user_details.user_type == UserType.manager) {
                // For manager
                const instituteIds: string[] = req.user_details.permissions.institutes
                    .filter((rule) => rule.allow.includes(Allow.read))
                    .map((rule) => rule.id)
                const response = await prisma.institute.findMany({
                    where: {
                        id: {
                            in: instituteIds
                        }
                    }
                })
                institutes = response
            }

            // Success Response.
            return httpResponse(req, res, 200, responseMessage.SUCCESS, institutes)
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

