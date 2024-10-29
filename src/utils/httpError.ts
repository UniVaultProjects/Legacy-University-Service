import { NextFunction, Request } from 'express'; // Import necessary types from Express
import errorObject from './errorObject'; // Import the error object utility

// Default export function for handling errors and passing them to the next middleware
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export default (nextFunc: NextFunction, err: Error | unknown, req: Request, errorStatusCode: number = 500): void => {
    // Create an error object using the imported errorObject utility
    const errorObj = errorObject(err, req, errorStatusCode);
    
    // Pass the created error object to the next middleware function for error handling
    return nextFunc(errorObj);
};
