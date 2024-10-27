import { Request, Response, NextFunction } from 'express';

/*

 CheckUserHandler is a handler that checks
 if the user is allowed to perfom specific operation or not
 req.user payload is check and that value is contained
 from authComm service
 if req.user['user-type'] is ADMIN and routing parameter is MANAGER
 it won't allow that operation.

*/

function checkUserHandler(user: 'ADMIN' | 'MANAGER') {
  return function (req: Request, res: Response, next: NextFunction) {
    // double typo checking ensures that req.user object exists .
    if (req.user && req.user['user-type'] === user) {
      next();
    } else {
      res.status(403).send('Access Denied!'); // Use 403 for forbidden access
    }
  };
}

export default checkUserHandler;
