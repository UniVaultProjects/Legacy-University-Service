import { Router } from 'express';
import instituteController from '../controller/Institute/instituteController';
import verifyToken from '../middleware/verifyToken';
import instituteValid from '../validation/institute.valid';

const router = Router()

/* Routes for institutions */
router.route('/institute').post(verifyToken.verifyToken,instituteValid.Validation,instituteController.InstitutePost);


export default router