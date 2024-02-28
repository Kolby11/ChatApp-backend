import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { AuthUtils } from '../authUtils'
import { loginService } from './loginService'

export async function loginController(req: Request, res: Response, next: NextFunction) {
  try {
    console.log(req.body)

    const RequestSchema = z.object({
      usernameOrEmail: z
        .string({ required_error: 'Username or Email is required' })
        .min(1, { message: 'Username or Email is required' })
        .max(32, { message: 'Username or Email must be less than 32 characters long' })
        .trim()
        .superRefine((value, ctx) => {
          if (!AuthUtils.usernameRegex.test(value) && !AuthUtils.emailRegex.test(value)) {
            ctx.addIssue({
              code: 'custom',
              path: ['usernameOrEmail'],
              message: 'Must be a valid username or email',
            })
          }
        }),
      password: z
        .string({ required_error: 'Password is required' })
        .min(8, { message: 'Password must be at least 8 characters long' })
        .max(32, { message: 'Password must be less than 32 characters long' })
        .trim()
        .refine(password => AuthUtils.specialCharacterRegex.test(password), {
          message: 'Password must contain at least one special character',
        }),
    })

    const validatedData = RequestSchema.parse(req.body)
    const { usernameOrEmail, password } = validatedData

    const params = { usernameOrEmail, password }

    const verified = await loginService(params)

    if (!verified) {
      return res.status(401).json({ message: 'Login unsuccessful' })
    }

    res.cookie('refreshToken', verified.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      sameSite: 'none',
      secure: false,
    })

    res.cookie('accessToken', verified.accessToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      sameSite: 'none',
      secure: false,
    })

    return res.status(200).json({ message: 'Login successful', accessToken: verified.accessToken })
  } catch (err) {
    next(err)
  }
}
