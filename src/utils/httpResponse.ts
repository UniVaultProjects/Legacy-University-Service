import { Request, Response } from 'express'; // Import necessary types from Express
import { HttpResponse } from '../types/types'; // Import custom HttpResponse type
import config from '../config/config'; // Import configuration settings
import { EApplicationEnvironment } from '../constant/application'; // Import application environment constants

// Default export function to send HTTP responses
export default (req: Request, res: Response, responseCode: number, responseMessage: string, data: unknown = null): void => {
    // Construct the response object
    const response: HttpResponse = {
        success: true, // Indicate the operation was successful
        statusCode: responseCode, // Set the HTTP status code
        request: {
            ip: req.ip || null, // Capture the IP address of the request, or null if not available
            method: req.method, // Capture the HTTP method (GET, POST, etc.)
            url: req.originalUrl // Capture the original URL of the request
        },
        message: responseMessage, // Set the response message
        data: data // Attach any additional data to the response
    };

    // Log the response object for debugging
    console.info(`CONTROLLER_RESPONSE`, {
        meta: response 
    });

    // In production, omit sensitive information like the request IP address
    if (config.ENV == EApplicationEnvironment.PRODUCTION) {
        delete response.request.ip; // Remove IP address from the response
    }

    // Send the constructed response object as a JSON response
    res.status(responseCode).json(response);
};
