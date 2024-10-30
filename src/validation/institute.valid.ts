import { Request, Response, NextFunction } from 'express' // Import necessary types from Express
import httpResponse from '../utils/httpResponse' // Import custom HTTP response utility
import Joi from 'joi' // Import Joi for data validation

// Define the structure for the request body
interface requestBody {
    name: string // Required: name of the item
    short_name: string // Required: short name for the item
    desc: string // Required: description of the item
    order_no: number // Required: order number (integer)
}

// Export the validation middleware
export default {
    post: (
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        req: Request<{}, {}, requestBody>, // Define the request type with an empty params and query
        res: Response, // Response type
        next: NextFunction // Next middleware function
    ) => {
        // Define validation schema for incoming request body
        const schema = Joi.object({
            name: Joi.string().min(3).max(75).required(), // Name must be a string between 3 and 75 characters
            short_name: Joi.string().required(), // Short name must be a string
            desc: Joi.string().required(), // Description must be a string
            order_no: Joi.number().integer().required() // Order number must be a required integer
        })

        // Destructure the request body to extract relevant fields

        // Validate the request body against the schema
        const { error } = schema.validate(req.body)

        // If there is a validation error, respond with an error message
        if (error) {
            return httpResponse(req, res, 400, error.message)
        }

        // If validation is successful, attach the validated data back to the req object
        req.body = {
            name: req.body.name,
            short_name: req.body.short_name,
            desc: req.body.desc,
            order_no: req.body.order_no
        } as requestBody

        // Call the next middleware in the stack
        next()
    }
}

