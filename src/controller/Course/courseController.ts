/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Prisma, PrismaClient } from '@prisma/client'
import { Request, Response, NextFunction } from 'express'
import httpResponse from '../../utils/httpResponse'
import responseMessage from '../../constant/responseMessage'
import httpError from '../../utils/httpError'
import { HttpResponse } from '../../types/httpTypes'
import { HttpStatusCode } from 'axios'

const prisma = new PrismaClient()

interface IPostCourseRequestBody {
    name: string
    short_name: string
    description: string
    order_no: number
    instituteId: string
}

export default {
    CoursePost: async (req: Request<{}, {}, NonNullable<IPostCourseRequestBody>>, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { name, short_name, description, order_no, instituteId } = req.body

            const courseData: IPostCourseRequestBody = {
                name,
                short_name,
                description,
                order_no,
                instituteId
            }

            const post = await prisma.course.create({
                data: courseData
            })

            httpResponse(req, res, 200, responseMessage.SUCCESS, post)
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2003') {
                    const body: HttpResponse = {
                        code: HttpStatusCode.BadRequest,
                        message: 'Invalid institute ID provided.',
                        data: {}
                    }
                    res.status(body.code).json(body)
                    return
                }

                if (error.code === 'P2002') {
                    const body: HttpResponse = {
                        code: HttpStatusCode.BadRequest,
                        message: 'A course with the same name or short name already exists.',
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

