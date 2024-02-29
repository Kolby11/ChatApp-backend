import { ChatAppDb } from '../../../../utils/mongodb'

type Props = {
  userId: string
}

export async function getMyChatsService(props: Props) {
  const { userId } = props

  const chats = await ChatAppDb.collection('chats')
    .find({ userIds: { $in: [userId] } })
    .toArray()

  return chats
}
