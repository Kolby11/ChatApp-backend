// ChatSocketController.js

import { Socket } from 'socket.io'
import { sendMessageService } from './sendMessageService'
import { userSockets } from '../../../../utils/socketSetup'
import { z } from 'zod'

type Params = {
  chatId: string
  userId: string
  message: string
}

export async function onSendMessage(socket: Socket, params: Params) {
  try {
    const EventSchema = z.object({
      chatId: z.string(),
      userId: z.string(),
      message: z.string(),
    })

    const { chatId, userId, message } = EventSchema.parse(params)

    const serviceData = {
      chatId,
      userId,
      message,
    }

    const chatDetails = await sendMessageService(serviceData)

    if (!chatDetails) {
      throw new Error('Chat not found')
    }
    // Notify the other users
    const notifyUserIds = chatDetails.userIds.filter(id => id !== params.userId)

    notifyUserIds.forEach(id => {
      userSockets[id] && socket.to(userSockets[id]).emit('message', chatDetails)
    })
  } catch (err) {
    if (err instanceof Error) {
      socket.emit('error', err.message)
    } else {
      socket.emit('error', 'An unknown error occurred')
    }
  }
}
