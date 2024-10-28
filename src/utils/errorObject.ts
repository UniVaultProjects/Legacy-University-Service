import { Request } from 'express'; // Import the Request type from Express
import { HttpError } from '../types/types'; // Import custom HttpError type
import responseMessage from '../constant/responseMessage'; // Import response messages
import config from '../config/config'; // Import configuration settings
import { EApplicationEnvironment } from '../constant/application'; // Import application environment constants

// Default export function for error handling
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export default (err: Error | unknown, req: Request, errorStatusCode: number = 500): HttpError => {
    // Create an error object with relevant information
    const errorObj: HttpError = {
        success: false, // Indicate the operation was unsuccessful
        statusCode: errorStatusCode, // Set the HTTP status code
        request: {
            ip: req.ip, // Capture the IP address of the request
            method: req.method, // Capture the HTTP method (GET, POST, etc.)
            url: req.originalUrl // Capture the original URL of the request
        },
        // Set the error message; if the error is an instance of Error, use its message
        message: err instanceof Error ? err.message || responseMessage.SOMETHING_WENT_WRONG : responseMessage.SOMETHING_WENT_WRONG,
        data: null, // No additional data to return
        // Capture the stack trace if the error is an instance of Error
        trace: err instanceof Error ? { err: err.stack } : null
    };

    // Log the error information for debugging
    console.info(`CONTROLLER_ERROR`, {
        meta: errorObj
    });

    // In production, omit sensitive information
    if (config.ENV == EApplicationEnvironment.PRODUCTION) {
        delete errorObj.request.ip; // Remove IP address from the response
        delete errorObj.trace; // Remove stack trace from the response
    }

    // Return the constructed error object
    return errorObj;
};
