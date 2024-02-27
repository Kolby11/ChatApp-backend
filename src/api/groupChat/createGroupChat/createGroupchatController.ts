import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { createGroupchatService } from './createGroupchatService'

export async function createGroupchatController(req: Request, res: Response, next: NextFunction) {
  try {
    const RequestSchema = z.object({
      body: z.object({
        name: z.string().min(1).max(32),
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
    const { name, userIds } = validatedData.body

    const params = {
      name,
      userIds,
    }

    const createdGroupchatId = await createGroupchatService(params)

    if (!createdGroupchatId) {
      return res.status(409).json({ message: 'Failed created groupchat' })
    }

    return res.status(201).json({ message: 'Successfully created groupchat', groupchatId: createdGroupchatId })
  } catch (err) {
    next(err)
  }
}
