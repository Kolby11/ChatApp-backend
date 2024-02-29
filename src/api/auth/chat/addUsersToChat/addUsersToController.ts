import { Response, NextFunction } from 'express'
import { z } from 'zod'
import { addUsersToChatService } from './addUsersToService'
import { RequestWithUserId } from '../../../../middleware/verifyJWT'

export async function addUsersToChatController(req: RequestWithUserId, res: Response, next: NextFunction) {
  try {
    const RequestSchema = z.object({
      userId: z.string(),
      params: z.object({
        groupchatId: z.string().uuid({ message: 'Invalid groupchat id format' }),
      }),
      body: z.object({
        userIds: z.array(z.string()).or(
          z.string().transform(str => {
            try {
              const parsed = JSON.parse(str)
              return z.array(z.string()).parse(parsed)
            } catch (e) {
              throw new Error('Invalid userIds format')
            }
          })
        ),
      }),
    })

    const validatedData = RequestSchema.parse(req)
    const { userId } = validatedData
    const { groupchatId } = validatedData.params
    const { userIds } = validatedData.body

    const params = {
      userId,
      groupchatId,
      userIds,
    }

    const addedUsersToGroupchat = await addUsersToChatService(params)

    if (!addedUsersToGroupchat) {
      return res.status(409).json({ message: 'Failed adding users to groupchat' })
    }

    return res.status(204).json({ message: 'Successfully added users to groupchat' })
  } catch (err) {
    next(err)
  }
}
