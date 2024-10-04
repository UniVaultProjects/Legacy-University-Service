import { Router } from 'express';
import instituteController from '../controller/instituteController';

const router = Router()

/* Routes for institutions */
router.route('/v1/institute').post(instituteController.InstitutePost)

export default router