/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Request, Response, NextFunction } from 'express'
import httpResponse from '../../utils/httpResponse'
import httpError from '../../utils/httpError'
import responseMessage from '../../constant/responseMessage'
import { PrismaClient, Prisma, Institute } from '@prisma/client'
import { UserType } from '../../enum/userType'
import { Allow } from '../../enum/permissionAllowed'
import { HttpResponse } from '../../types/httpTypes'
import { HttpStatusCode } from 'axios'

const prisma = new PrismaClient()

interface PostInstituteRequestBody {
    name: string
    short_name: string
    description: string
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
            const { name, short_name, description, order_no } = req.body

            // Prepare the institute data
            const instituteData = {
                name, // Using the destructured variable
                short_name, // Using the destructured variable
                description, // Using the destructured variable
                order_no // Using the destructured variable
            }

            const post = await prisma.institute.create({
                data : instituteData
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
            const { id } = req.body

            // Find Object by id
            const deletedInstitute = await prisma.institute.delete({
                where: { id: id }
            })

            // Send a success response & deleted record.
            httpResponse(req, res, 200, responseMessage.SUCCESS, deletedInstitute)
        } catch (error) {
            // If the record is not found, Prisma throws an error
            // Type assertion for error
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    const body: HttpResponse = {
                        code: HttpStatusCode.BadRequest,
                        message: 'institute not found!',
                        data: {}
                    }
                    res.status(body.code).json(body)
                    return
                }
            }
            httpError(next, error, req, 500)
        }
    }
}

