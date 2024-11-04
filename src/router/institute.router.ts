import { Router } from 'express'
import instituteController from '../controller/Institute/instituteController'
import authComm from '../middleware/authComm'
import instituteValid from '../validation/institute.valid'
import checkUserHandler from '../middleware/checkUser'
import { UserType } from '../enum/userType'

// Create a new router instance for handling institution-related routes
const instituteRouter = Router()

/* Routes for institutions */

// Route to all a new institute
// Requires token verification and validation
instituteRouter.route('/').get(authComm.verifyToken, checkUserHandler([UserType.admin,UserType.manager]), instituteController.InstituteGet)

// Route to create a new institute
// Requires token verification and validation
instituteRouter.route('/').post(authComm.verifyToken, checkUserHandler([UserType.admin]), instituteValid.post, instituteController.InstitutePost)

// Route to delete an existing institute
// Requires token verification
instituteRouter.route('/').delete(authComm.verifyToken, checkUserHandler([UserType.admin]), instituteController.InstituteDelete)


// Export the router for use in other parts of the application
export default instituteRouter
