import { Request, Response, NextFunction } from 'express'
import { UserType } from '../enum/userType'

/*

 CheckUserHandler is a handler that checks
 if the user is allowed to perfom specific operation or not
 req.user payload is check and that value is contained
 from authComm service
 if req.user['user-type'] is ADMIN and routing parameter is MANAGER
 it won't allow that operation.

*/

function checkUserHandler(users: UserType[]) {
    return function (req: Request, res: Response, next: NextFunction) {
        try {
            // double typo checking ensures that req.user object exists .
            if (req.user_details && users.includes(req.user_details.user_type)) {
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
