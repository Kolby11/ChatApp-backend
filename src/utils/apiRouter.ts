import { Router } from 'express'
import { authRouter } from '../api/auth/authRoutes'
import { userRouter } from '../api/user/userRoutes'
import { chatRouter } from '../api/auth/chat/chatRouter'

// API Router
export const apiRouter = Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/chat', chatRouter)
apiRouter.use('/user', userRouter)
