import { Router } from 'express'
import { authRouter } from '../api/auth/authRoutes'

// API Router
export const apiRouter = Router()

apiRouter.use('/auth', authRouter)
