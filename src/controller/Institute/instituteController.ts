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
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { IPostRequestBody, IUpdateRequestBody, IDeleteRequestBody } from '../../interfaces/institute.interfaces'

const prisma = new PrismaClient()

export default {
    /**
   * @Route: GET /institute
    Export an object with login method for user authentication.
    Here AuthComm is passing a req.ops object that contains
    various metadata such as institute id's and operations allowed.
    only allowed operation [GET] and allowed institutes can be accesed.
   **/

    get: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user_details) {
                throw new Error('Something went wrong!')
            }

            let institutes: Institute[] = []
            if (req.user_details.user_type == UserType.admin) {
                // For admin
                const response = await prisma.institute.findMany({
                    include: {
                        courses: true
                    }
                })
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
            return httpResponse(res, 200, responseMessage.SUCCESS, institutes)
        } catch (error) {
            httpError(next, error, req, 500)
        }
    },

    // Create institute
    post: async (req: Request<{}, {}, NonNullable<IPostRequestBody>>, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { name, short_name, description, order_no } = req.body

            // Prepare the institute data
            const instituteData: IPostRequestBody = {
                name, // Using the destructured variable
                short_name, // Using the destructured variable
                description, // Using the destructured variable
                order_no // Using the destructured variable
            }

            const post = await prisma.institute.create({
                data: instituteData
            })

            // Send a success response
            httpResponse(res, 200, responseMessage.SUCCESS, post)
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    const body: HttpResponse = {
                        code: HttpStatusCode.Conflict,
                        message: 'A institute with the same name or short name already exists.',
                        data: {}
                    }
                    res.status(body.code).json(body)
                    return
                }
            }
            httpError(next, error, req, 500)
        }
    },

    // Delete institute
    delete: async (req: Request<{}, {}, IDeleteRequestBody>, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.body

            // Start a transaction to ensure both operations are atomic
            const result = await prisma.$transaction(async (prisma) => {
                // First, check if any courses exist for the given institute
                const existingCourses = await prisma.course.findMany({
                    where: {
                        instituteId: id
                    }
                })

                if (existingCourses.length > 0) {
                    // If courses exist, delete them
                    await prisma.course.deleteMany({
                        where: {
                            instituteId: id
                        }
                    })
                } else {
                    // If no courses exist, skip the deletion of courses and proceed with deleting the institute
                    // eslint-disable-next-line no-console
                    console.error('No related courses found for the institute.')
                }

                // Now, delete the institute
                const deletedInstitute = await prisma.institute.delete({
                    where: {
                        id: id
                    }
                })

                // Return the result of the deleted institute
                return deletedInstitute
            })
            // Send a success response & deleted record.
            httpResponse(res, 200, responseMessage.SUCCESS, result)
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
    },
    // Delete institute
    update: async (req: Request<{}, {}, IUpdateRequestBody>, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id, name, short_name, description, order_no } = req.body

            // Find Object by id
            const updateInstitute = await prisma.institute.update({
                where: {
                    id: id
                },
                data: {
                    name,
                    short_name,
                    description,
                    order_no
                }
            })

            // Send a success response & deleted record.
            httpResponse(res, 200, responseMessage.SUCCESS, updateInstitute)
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

