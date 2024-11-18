// Define the structure for the request body
export interface IPostRequestBody {
    name: string // Required: name of the item
    short_name: string // Required: short name for the item
    description: string // Required: description of the item
    institute: {
        // Required : for associativity between institute & course
        connect: {
            id: string
        }
    }
    order_no: number // Required: order number (integer)
}
export interface IUpdateRequestBody {
    id: string // Institute ID for updating
    name: string // Name of the institute
    short_name: string // Short name of the institute
    description: string // Description of the institute
    order_no: number // Order number (or some other ordering criteria)
}

export interface IDeleteRequestBody {
    id: string
}

export interface ValidationErrorResponse {
    error: string // Describes the type of the error (e.g., 'Validation Error')
    message: string // The error message (e.g., specific Joi validation message)
    type: 'Joi Validation Error' // Type of the error, specifically 'Joi Validation Error'
}

export interface ValidationErrorResponse {
    error: string // Describes the type of the error (e.g., 'Validation Error')
    message: string // The error message (e.g., specific Joi validation message)
    type: 'Joi Validation Error' // Type of the error, specifically 'Joi Validation Error'
}

