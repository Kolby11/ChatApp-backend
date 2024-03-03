import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { AuthUtils } from '../authUtils'

/** Refresh */
export async function refreshController(req: Request, res: Response, next: NextFunction) {
  try {
    const RequestSchema = z.object({
      cookies: z.object({
        refreshToken: z.string().min(1),
      }),
    })

    const validatedData = RequestSchema.parse(req)

    const refreshToken = validatedData.cookies.refreshToken

    const accessToken = await AuthUtils.getAccessToken(refreshToken)

    if (accessToken === null) {
      return res.sendStatus(403)
    }

    res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: false, maxAge: 24 * 60 * 60 * 1000 })
    return res.json({ accessToken })
  } catch (err) {
    next(err)
  }
}
