import { Router } from 'express'
import { registerController } from './register/registerController'
import { loginController } from './login/loginController'
import { logoutController } from './logout/logoutController'

export const authRouter = Router()

authRouter.route('/login').post(loginController)
authRouter.route('/register').post(registerController)
authRouter.route('/logout').get(logoutController)
