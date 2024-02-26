import { Router } from 'express'
import { registerController } from './register/registerController'

export const authRouter = Router()

authRouter.route('/register').post(registerController)
