import { Router } from 'express'
import instituteRouter from '../router/institute.router'
import courseRouter from '../router/course.router'

const indexRouter = Router()

// Requires token verification and validation
indexRouter.use('/institute',instituteRouter);
indexRouter.use('/course',courseRouter);

export default indexRouter