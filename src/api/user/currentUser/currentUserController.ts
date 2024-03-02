import { Response, NextFunction } from 'express'
import { currentUserService } from './currentUserService'
import { RequestWithUserId } from '../../../middleware/verifyJWT'

export async function currentUserController(req: RequestWithUserId, res: Response, next: NextFunction) {
  try {
    const userId = req.userId

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const user = await currentUserService({ userId })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json(user)
  } catch (err) {
    next(err)
  }
}
