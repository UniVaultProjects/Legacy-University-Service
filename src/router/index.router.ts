import { Router } from 'express'
import instituteRouter from '../router/institute.router'
import courseRouter from '../router/course.router'
import branchRouter from '../router/branch.router'

const indexRouter = Router()

// Requires token verification and validation
indexRouter.use('/institute',instituteRouter);
indexRouter.use('/course',courseRouter);
indexRouter.use('/branch',branchRouter);

export default indexRouter