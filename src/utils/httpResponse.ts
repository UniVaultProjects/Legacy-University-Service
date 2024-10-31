import { Request, Response } from 'express'; // Import necessary types from Express
import { HttpResponse } from '../types/httpTypes'; // Import custom HttpResponse type

// Default export function to send HTTP responses
export default (_: Request, res: Response, responseCode: number, responseMessage: string, data: unknown = null): void => {
    // Construct the response object
    const response: HttpResponse = {
        code: responseCode, // Set the HTTP status code
        message: responseMessage, // Set the response message
        data: data // Attach any additional data to the response
    };

    // Send the constructed response object as a JSON response
    res.status(responseCode).json(response);
};
