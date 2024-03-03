import { Router } from 'express'
import { registerController } from './register/registerController'
import { loginController } from './login/loginController'
import { logoutController } from './logout/logoutController'
import { refreshController } from './refresh/refreshController'

export const authRouter = Router()

authRouter.route('/refresh').get(refreshController)
authRouter.route('/login').post(loginController)
authRouter.route('/register').post(registerController)
authRouter.route('/logout').get(logoutController)
