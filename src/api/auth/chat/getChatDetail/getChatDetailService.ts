import { ObjectId } from 'mongodb'
import { ChatAppDb } from '../../../../utils/mongodb'
import { ChatTypes } from '../types'

type Props = {
  chatId: string
  userId: string
}

export const getChatDetailService = async (props: Props) => {
  const { chatId, userId } = props

  const objectId = new ObjectId(chatId)

  const chat = await ChatAppDb.collection('chats').findOne({
    _id: objectId,
    users: { $in: [userId] },
  })

  if (!chat) {
    throw new ChatTypes.ChatNotFoundError('Chat not found')
  }

  return chat
}
