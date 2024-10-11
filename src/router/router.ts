import { Router } from 'express';
import instituteController from '../controller/instituteController';
import verifyToken from '../middleware/verifyToken';

const router = Router()

/* Routes for institutions */
router.route('/v1/institute').get(instituteController.testGet)
router.route('/v1/institute').post(verifyToken.verifyToken,instituteController.InstitutePost)

export default router