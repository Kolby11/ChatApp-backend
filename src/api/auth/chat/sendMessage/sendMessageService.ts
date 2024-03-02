import { ObjectId } from 'mongodb'
import { ChatAppDb } from '../../../../utils/mongodb'

type Props = {
  userId: string
  chatId: string
  message: string
}

interface ChatDocument {
  _id: ObjectId
  messages: {
    userId: string
    message: string
    createdAt: Date
  }[]
  userIds: string[]
}

export async function sendMessageService(props: Props) {
  const { userId, chatId, message } = props

  const messageObj = {
    userId,
    message,
    createdAt: new Date(),
  }

  const objectId = new ObjectId(chatId)

  const updatedChat = await ChatAppDb.collection<ChatDocument>('chats').findOneAndUpdate(
    { _id: objectId },
    { $push: { messages: messageObj } },
    { returnDocument: 'after' }
  )

  return updatedChat
}
