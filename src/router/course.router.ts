import { Router } from 'express'
import courseController from '../controller/Course/courseController'
import courseValid from '../validation/course.valid'



// Create a new router instance for handling institution-related routes
const courseRouter = Router()

// Route to create a new course
// Requires token verification and validation
courseRouter.route('/').post(courseValid.post,courseController.CoursePost);

export default courseRouter