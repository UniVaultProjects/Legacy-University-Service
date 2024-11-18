import { Request, Response, NextFunction } from 'express' // Import necessary types from Express
import httpResponse from '../utils/httpResponse' // Import custom HTTP response utility
import Joi from 'joi' // Import Joi for data validation
import {IDeleteRequestBody,IPostRequestBody,IUpdateRequestBody,ValidationErrorResponse} from '../interfaces/course.interface'

// Export the validation middleware
export default {
    post: (
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        req: Request<{}, {}, IPostRequestBody>, // Define the request type with an empty params and query
        res: Response, // Response type
        next: NextFunction // Next middleware function
    ) => {
        try {
            // Define validation schema for incoming request body
            const schema = Joi.object({
                name: Joi.string().min(3).max(75).required(), // Name must be a string between 3 and 75 characters
                short_name: Joi.string().required(), // Short name must be a string
                description: Joi.string().required(), // Description must be a string
                order_no: Joi.number().integer().required(), // Order number must be a required integer,
                institute: Joi.object({
                    connect: Joi.object({
                        id: Joi.string().length(24).required() // Institute ID must be a 24-character string
                    }).required()
                }).required() // Institute field must be provided
            })

            // Destructure the request body to extract relevant fields

            // Validate the request body against the schema
            const { error } = schema.validate(req.body)

            // If there is a validation error, respond with an error message
            if (error) {
                return httpResponse(res, 400, error.message)
            }

            // If validation is successful, attach the validated data back to the req object
            req.body = {
                name: req.body.name,
                short_name: req.body.short_name,
                description: req.body.description,
                order_no: req.body.order_no,
                institute : req.body.institute
            } as IPostRequestBody

            // Call the next middleware in the stack
            next()
        } catch (error) {
            if (error instanceof Error) {
                return httpResponse(res, 500, error.message, null)
            }

            // For some reason, if we get an unknown error, handle it as a fallback
            return httpResponse(res, 500, 'An unknown error occurred', null)
        }
    },
    update: (
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        req: Request<{}, {}, IUpdateRequestBody>, // Define the request type with an empty params and query
        res: Response, // Response type
        next: NextFunction // Next middleware function
    ) => {
        try {
            // Define validation schema for incoming request body
            const schema = Joi.object({
                id: Joi.string().required(),
                name: Joi.string().min(3).max(75).required(), // Name must be a string between 3 and 75 characters
                short_name: Joi.string().required(), // Short name must be a string
                description: Joi.string().required(), // Description must be a string
                order_no: Joi.number().integer().required(), // Order number must be a required integer
                institute : Joi.string().optional()
            })


            // Destructure the request body to extract relevant fields

            // Validate the request body against the schema
            const { error } = schema.validate(req.body)

            // If there is a validation error, respond with an error message
            if (error) {
                return httpResponse(res, 400, error.message)
            }

            // If validation is successful, attach the validated data back to the req object
            req.body = {
                name: req.body.name,
                short_name: req.body.short_name,
                description: req.body.description,
                order_no: req.body.order_no
            } as IUpdateRequestBody

            // Call the next middleware in the stack
            next()
        } catch (error) {
            if (error instanceof Error) {
                return httpResponse(res, 500, error.message, null)
            }

            // For some reason, if we get an unknown error, handle it as a fallback
            return httpResponse(res, 500, 'An unknown error occurred', null)
        }
    },

    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    delete: (req: Request<{}, {}, IDeleteRequestBody>, res: Response, next: NextFunction) => {
        try {
            // Define a schema to validate the request body
            const schema = Joi.object({
                id: Joi.string().guid({ version: 'uuidv4' }).required().messages({
                    'string.guid': 'The id must be a valid UUID.',
                    'any.required': 'The id field is required.'
                })
            })

            // decontruct joi object which contains error
            const { error } = schema.validate(req.body)

            // if error return it . should describe joi error
            if (error) {
                // Create a ValidationErrorResponse type for structured error response
                const validationErrorResponse: ValidationErrorResponse = {
                    error: 'Validation Error',
                    message: error.details[0].message,
                    type: 'Joi Validation Error'
                }

                return httpResponse(res, 400, validationErrorResponse.message, validationErrorResponse)
            }

            // attaching validated value to request body object
            req.body = {
                id: req.body.id
            } as IDeleteRequestBody

            next()
        } catch (error) {
            if (error instanceof Error) {
                return httpResponse(res, 500, error.message, null)
            }

            // For some reason, if we get an unknown error, handle it as a fallback
            return httpResponse(res, 500, 'An unknown error occurred', null)
        }
    }
}

