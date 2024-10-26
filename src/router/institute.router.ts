import { Router } from 'express';
import instituteController from '../controller/Institute/instituteController';
import verifyToken from '../middleware/verifyToken';
import instituteValid from '../validation/institute.valid';

// Create a new router instance for handling institution-related routes
const router = Router();

/* Routes for institutions */

// Route to create a new institute
// Requires token verification and validation
router.route('/institute')
  .post(verifyToken.verifyToken, instituteValid.Validation, instituteController.InstitutePost);

// Route to delete an existing institute
// Requires token verification
router.route('/institute')
  .delete(verifyToken.verifyToken, instituteController.InstituteDelete);

// Export the router for use in other parts of the application
export default router;
