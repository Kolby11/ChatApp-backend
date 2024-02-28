import { Router } from 'express'
import { currentUserController } from './currentUser/currentUserController';
import { verifyJWT } from '../../middleware/verifyJWT';
export const userRouter = Router()

userRouter.get('/currentuser', verifyJWT, currentUserController);
