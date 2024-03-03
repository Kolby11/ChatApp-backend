import { ObjectId } from 'mongodb'
import { ChatAppDb } from '../../../../utils/mongodb'
import { UserTypes } from '../../../user/types'

type Props = {
  userId: string
  chatId: string
  message: string
}

interface ChatDocument {
  _id: ObjectId
  messages: {
    user: {
      userId: string
      username: string
    }
    message: string
    createdAt: Date
  }[]
  userIds: string[]
}

export async function sendMessageService(props: Props) {
  const { userId, chatId, message } = props

  const user = await ChatAppDb.collection('users').findOne({ _id: new ObjectId(userId) })

  if (!user) {
    throw new UserTypes.UserNotFoundError('User not found')
  }

  const messageObj = {
    user: {
      userId,
      username: user.username,
    },
    message,
    createdAt: new Date(),
  }

  const objectId = new ObjectId(chatId)

  const updatedChat = await ChatAppDb.collection<ChatDocument>('chats').findOneAndUpdate(
    { _id: objectId },
    { $push: { messages: messageObj } },
    { returnDocument: 'after' }
  )

  if (!updatedChat) {
    throw new Error('Chat not found')
  }

  const parsedChat = { ...updatedChat, _id: updatedChat._id.toString() }

  return parsedChat
}
