import { NextFunction, Request, Response } from 'express'
import { Usertypes } from '../../user/types'
import { AuthUtils } from '../authUtils'
import { z } from 'zod'
import { registerService } from './registerService'

export async function registerController(req: Request, res: Response, next: NextFunction) {
  try {
    const ReqSchema = z.object({
      body: z
        .object({
          username: z
            .string({ required_error: 'Username is required' })
            .min(1, { message: 'Username is required' })
            .max(32, { message: 'Username must be less than 32 characters long' })
            .trim()
            .refine(username => AuthUtils.usernameRegex.test(username), {
              message: 'Username may contain only alfanumerical characters and  ',
              path: ['username'],
            }),
          email: z
            .string({ required_error: 'Email is required' })
            .email({ message: 'Invalid email format' })
            .min(1, { message: 'Email is required' })
            .max(64, { message: 'Email must be less than 64 characters long' })
            .trim(),
          password: z
            .string({ required_error: 'Password is required' })
            .min(8, { message: 'Password must be at least 8 characters long' })
            .max(32, { message: 'Password must be less than 32 characters long' })
            .trim()
            .refine(password => AuthUtils.specialCharacterRegex.test(password), {
              message: 'Password must contain at least one special character',
            }),
          passwordConfirm: z
            .string({ required_error: 'Password confirmation is required' })
            .min(8, { message: 'Password confirmation must be at least 8 characters long' })
            .max(32, { message: 'Password confirmation must be less than 32 characters long' })
            .trim()
            .refine(password => AuthUtils.specialCharacterRegex.test(password), {
              message: 'Password confirmation must contain at least one special character',
            }),
        })
        .superRefine(({ password, passwordConfirm }, ctx) => {
          if (password !== passwordConfirm) {
            ctx.addIssue({
              code: 'custom',
              message: "Passwords don't match",
              path: ['password'],
            })
            ctx.addIssue({
              code: 'custom',
              message: "Passwords don't match",
              path: ['passwordConfirm'],
            })
          }
        }),
    })
    const validateData = ReqSchema.parse(req)
    const { body } = validateData

    const { passwordConfirm, ...params } = body

    const createdUser = await registerService(params)

    if (!createdUser) {
      return res.status(400).json({ message: 'Registration failed!' })
    }

    return res.status(200).json({
      message: 'Registration successful!',
    })
  } catch (err) {
    next(err)
  }
}
