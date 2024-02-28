import { Router } from 'express'
import { authRouter } from '../api/auth/authRoutes'
import { groupchatRouter } from '../api/groupChat/groupchatRouter'
import { userRouter } from '../api/user/userRoutes'

// API Router
export const apiRouter = Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/groupchat', groupchatRouter)
apiRouter.use('/user',userRouter)
