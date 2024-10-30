import { Request, Response, NextFunction } from 'express'
import { UserType } from '../enum/user-type'

/*

 CheckUserHandler is a handler that checks
 if the user is allowed to perfom specific operation or not
 req.user payload is check and that value is contained
 from authComm service
 if req.user['user-type'] is ADMIN and routing parameter is MANAGER
 it won't allow that operation.

*/

function checkUserHandler(user: UserType) {
    return function (req: Request, res: Response, next: NextFunction) {
        try {
            // double typo checking ensures that req.user object exists .
            if (req.user_details && req.user_details.user_type === user) {
                next()
            } else {
                res.status(403).send('Access Denied!') // TODO:Use 403 for forbidden access
            }
        } catch (error) {
            throw error
        }
    }
}

export default checkUserHandler
