import { Router } from 'express'
import { currentUserController } from './currentUser/currentUserController'
import { verifyJWT } from '../../middleware/verifyJWT'
import { getAllUsersController } from './getAllUsers.ts/getAllUsersController'
export const userRouter = Router()

// Special routes
userRouter.route('/currentUser').get(verifyJWT, currentUserController)

// CRUD routes
userRouter.route('/').get(getAllUsersController)
