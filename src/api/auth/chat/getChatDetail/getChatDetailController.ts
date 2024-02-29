import { Request, Response, NextFunction } from 'express'
import { RequestWithUserId } from '../../../../middleware/verifyJWT'
import { z } from 'zod'
import { getChatDetailService } from './getChatDetailService'

export async function getChatDetailController(req: RequestWithUserId, res: Response, next: NextFunction) {
  try {
    const RequestSchema = z.object({
      userId: z.string(),
      params: z.object({
        chatId: z.string(),
      }),
    })

    const validatedData = RequestSchema.parse(req)
    const { userId } = validatedData
    const { chatId } = validatedData.params

    const chat = await getChatDetailService({ chatId, userId })

    res.json(chat)
  } catch (err) {
    next(err)
  }
}
