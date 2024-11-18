/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Request, Response, NextFunction } from 'express'
import httpResponse from '../../utils/httpResponse'
import httpError from '../../utils/httpError'
import responseMessage from '../../constant/responseMessage'
import { PrismaClient, Prisma, Branch } from '@prisma/client'
import { HttpResponse } from '../../types/httpTypes'
import { HttpStatusCode } from 'axios'
import { IPostRequestBody, IUpdateRequestBody, IDeleteRequestBody } from '../../interfaces/branch.interface'

const prisma = new PrismaClient()

export default {
    get: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response: Branch[] = await prisma.branch.findMany()

            // Success Response.
            return httpResponse(res, 200, responseMessage.SUCCESS, response)
        } catch (error) {
            httpError(next, error, req, 500)
        }
    },

    // Create institute
    post: async (req: Request<{}, {}, NonNullable<IPostRequestBody>>, res: Response, next: NextFunction): Promise<void> => {
        try {
            let post
            const { name, short_name, description, order_no, course } = req.body

            if (!course || !course.connect || !course.connect.id) {
                const body: HttpResponse = {
                    code: HttpStatusCode.BadRequest,
                    message: 'Institute connection data is missing.',
                    data: {}
                }
                res.status(body.code).json(body)
                return
            }

            // Prepare the institute data
            const branchData: IPostRequestBody = {
                name, // Using the destructured variable
                short_name, // Using the destructured variable
                description, // Using the destructured variable
                order_no, // Using the destructured variable
                course: {
                    connect: {
                        id: course.connect.id
                    }
                }
            }

            // Check if an Institute with the same name, short_name, description, and order_no already exists
            const existingBranch = await prisma.branch.findFirst({
                where: {
                    OR: [{ name }, { short_name }]
                }
            })

            if (existingBranch) {
                // If an institute with the same attributes exists, send a conflict response
                const body: HttpResponse = {
                    code: HttpStatusCode.Conflict,
                    message: 'An branch with the same name , short name already exists',
                    data: {}
                }
                res.status(body.code).json(body)
            } else {
                post = await prisma.branch.create({
                    data: branchData
                })
                httpResponse(res, 200, responseMessage.SUCCESS, post)
            }

            // Send a success response
        } catch (error: unknown) {
            httpError(next, error, req, 500)
        }
    },

    // Delete institute
    delete: async (req: Request<{}, {}, IDeleteRequestBody>, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.body

            // Start a transaction to ensure both operations are atomic
            const result = await prisma.$transaction(async (prisma) => {
                const response = await prisma.branch.delete({
                    where: {
                        id: id
                    }
                })
                return response
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
                        message: 'branch not found!',
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
            const updateInstitute = await prisma.branch.update({
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

