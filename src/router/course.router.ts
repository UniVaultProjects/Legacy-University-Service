import { Router } from 'express'
import courseController from '../controller/Course/courseController'
import courseValid from '../validation/course.valid'
import checkUserHandler from '../middleware/checkUser'
import authComm from '../middleware/authComm'
import { UserType } from '../enum/userType'


// Create a new router instance for handling institution-related routes
const courseRouter = Router()

// Route to get a all course & allowed courses
// Requires token verification and validation
courseRouter.route('/').get(authComm.verifyToken, checkUserHandler([UserType.admin, UserType.manager]), courseController.CourseGet)

// Route to create a new course
// Requires token verification and validation
courseRouter.route('/').post(authComm.verifyToken, checkUserHandler([UserType.admin]), courseValid.post, courseController.CoursePost)

export default courseRouter
