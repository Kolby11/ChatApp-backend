import { Response, NextFunction } from 'express'
import { RequestWithUserId } from '../../../../middleware/verifyJWT'
import { z } from 'zod'
import { getMyChatsService } from './getMyChatsService'

export async function getMyChatsController(req: RequestWithUserId, res: Response, next: NextFunction) {
  try {
    const RequestSchema = z.object({
      userId: z.string(),
    })

    const { userId } = RequestSchema.parse(req)

    const chats = await getMyChatsService({ userId })

    res.json(chats)
  } catch (err) {
    next(err)
  }
}
