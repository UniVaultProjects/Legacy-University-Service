import { Router } from 'express';
import instituteController from '../controller/instituteController';
import verifyToken from '../middleware/verifyToken';

const router = Router()

/* Routes for institutions */
router.route('/institute').get(instituteController.testGet)
router.route('/institute').post(verifyToken.verifyToken,instituteController.InstitutePost)

export default router