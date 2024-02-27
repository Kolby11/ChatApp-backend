import { Request, Response, NextFunction } from 'express'
import { logoutService } from './logoutService'

/** Logout */
export async function logoutController(req: Request, res: Response, next: NextFunction) {
  try {
    const cookies = req.cookies

    if (!cookies?.refreshToken) {
      return res.sendStatus(204)
    }

    const refreshToken = cookies.refreshToken

    // Check if the refresh token is in the user in database
    const removedToken = await logoutService(refreshToken)

    res.clearCookie('refreshToken', { httpOnly: true, sameSite: false })
    res.clearCookie('accessToken', { httpOnly: true, sameSite: false })

    if (!removedToken) {
      return res.sendStatus(400)
    }

    res.sendStatus(204)
  } catch (err) {
    next(err)
  }
}
