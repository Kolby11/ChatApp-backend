import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { addUsersToGroupchatService } from './addUsersToGroupchatService'

export async function addUsersToGroupchatController(req: Request, res: Response, next: NextFunction) {
  try {
    const RequestSchema = z.object({
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
    const { groupchatId } = validatedData.params
    const { userIds } = validatedData.body

    const params = {
      groupchatId,
      userIds,
    }

    const addedUsersToGroupchat = await addUsersToGroupchatService(params)

    if (!addedUsersToGroupchat) {
      return res.status(409).json({ message: 'Failed adding users to groupchat' })
    }

    return res.status(204).json({ message: 'Successfully added users to groupchat' })
  } catch (err) {
    next(err)
  }
}
