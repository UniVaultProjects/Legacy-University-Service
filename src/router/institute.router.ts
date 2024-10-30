import { Router } from 'express'
import instituteController from '../controller/Institute/instituteController'
import authComm from '../middleware/authComm'
import instituteValid from '../validation/institute.valid'

// Create a new router instance for handling institution-related routes
const router = Router()

/* Routes for institutions */

// Route to all a new institute
// Requires token verification and validation
router.route('/institute').get(authComm.verifyToken, instituteController.InstituteGet)

// Route to create a new institute
// Requires token verification and validation
router.route('/institute').post(authComm.verifyToken, instituteValid.post, instituteController.InstitutePost)

// Route to delete an existing institute
// Requires token verification
router.route('/institute').delete(authComm.verifyToken, instituteController.InstituteDelete)

// Export the router for use in other parts of the application
export default router
