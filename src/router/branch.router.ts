import { Router } from 'express'
import branchController from '../controller/branch/branchController'
import authComm from '../middleware/authComm'
import branchValid from '../validation/branch.valid'

// Create a new router instance for handling institution-related routes
const branchRouter = Router()

/* Routes for institutions */

// Route to all a new institute
// Requires token verification and validation
branchRouter.route('/').get(authComm.verifyToken, branchController.get)

// Route to create a new institute
// Requires token verification and validation
branchRouter.route('/').post(authComm.verifyToken, branchValid.post, branchController.post)

// Route to delete an existing institute
// Requires token verification
branchRouter.route('/').delete(authComm.verifyToken, branchValid.delete, branchController.delete)

// Route to delete an existing institute
// Requires token verification
branchRouter.route('/').put(authComm.verifyToken, branchValid.update, branchController.update)

// Export the router for use in other parts of the application
export default branchRouter

