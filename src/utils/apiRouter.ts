import { Router } from 'express'
import { authRouter } from '../api/auth/authRoutes'
import { groupchatRouter } from '../api/groupChat/groupchatRouter'

// API Router
export const apiRouter = Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/groupchat', groupchatRouter)
