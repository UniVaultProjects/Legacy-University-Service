/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Course, Prisma, PrismaClient } from '@prisma/client'
import { Request, Response, NextFunction } from 'express'
import httpResponse from '../../utils/httpResponse'
import responseMessage from '../../constant/responseMessage'
import httpError from '../../utils/httpError'
import { HttpResponse } from '../../types/httpTypes'
import { HttpStatusCode } from 'axios'
import { UserType } from '../../enum/userType'
import { Allow } from '../../enum/permissionAllowed'
import { IPostRequestBody, IDeleteRequestBody, IUpdateRequestBody } from '../../interfaces/course.interface'

const prisma = new PrismaClient()

export default {
    get: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.user_details) {
                httpError(next, responseMessage.SOMETHING_WENT_WRONG, req, 500)
                return
            }
            let courses: Course[] = []

            if (req.user_details?.user_type == UserType.admin) {
                const response = await prisma.course.findMany({
                    include: {
                        branches: true
                    }
                })
                courses = response
            } else if (req.user_details?.user_type == UserType.manager) {
                const courseIds: string[] = req.user_details.permissions.courses
                    .filter((rule) => rule.allow.includes(Allow.read))
                    .map((rule) => rule.id)
                const response = await prisma.course.findMany({
                    where: {
                        id: {
                            in: courseIds
                        }
                    }
                })
                courses = response
            }
            return httpResponse(res, 200, responseMessage.SUCCESS, courses)
        } catch (error) {
            throw error
        }
    },
    post: async (req: Request<{}, {}, NonNullable<IPostRequestBody>>, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { name, short_name, description, order_no, institute } = req.body

            if (!institute || !institute.connect || !institute.connect.id) {
                const body: HttpResponse = {
                    code: HttpStatusCode.BadRequest,
                    message: 'Institute connection data is missing.',
                    data: {}
                }
                res.status(body.code).json(body)
                return
            }
            const courseData = {
                name,
                short_name,
                description,
                order_no,
                institute: {
                    connect: { id: institute.connect.id }
                }
            }

            const post = await prisma.course.create({
                data: courseData
            })

            httpResponse(res, 200, responseMessage.SUCCESS, post)
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2003') {
                    const body: HttpResponse = {
                        code: HttpStatusCode.BadRequest,
                        message: 'Invalid courseID provided.',
                        data: {}
                    }
                    res.status(body.code).json(body)
                    return
                }

                if (error.code === 'P2002') {
                    const body: HttpResponse = {
                        code: HttpStatusCode.Conflict,
                        message: 'A course with the same name or short name already exists.',
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

            // Find Object by id
            const deletedInstitute = await prisma.course.delete({
                where: { id: id }
            })

            // Send a success response & deleted record.
            httpResponse(res, 200, responseMessage.SUCCESS, deletedInstitute)
        } catch (error) {
            // If the record is not found, Prisma throws an error
            // Type assertion for error
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    const body: HttpResponse = {
                        code: HttpStatusCode.BadRequest,
                        message: 'Course not found!',
                        data: {}
                    }
                    res.status(body.code).json(body)
                    return
                }
            }
            httpError(next, error, req, 500)
        }
    },
    // Update institute
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
                        message: 'Course not found!',
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

