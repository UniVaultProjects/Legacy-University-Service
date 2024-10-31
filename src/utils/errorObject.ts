import { Request } from 'express'; // Import the Request type from Express
import { HttpError } from '../types/httpTypes'; // Import custom HttpError type
import responseMessage from '../constant/responseMessage'; // Import response messages

// Default export function for error handling
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export default (err: Error | unknown, _: Request, errorStatusCode: number = 500): HttpError => {
    // Create an error object with relevant information
    const errorObj: HttpError = {
        code: errorStatusCode, // Set the HTTP status code
        // Set the error message; if the error is an instance of Error, use its message
        message: err instanceof Error ? err.message || responseMessage.SOMETHING_WENT_WRONG : responseMessage.SOMETHING_WENT_WRONG,
        data: null, // No additional data to return
    };

    // Return the constructed error object
    return errorObj;
};
