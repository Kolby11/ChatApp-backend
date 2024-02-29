import { ChatAppDb } from '../../../../utils/mongodb'

type Params = {
  name: string
  userIds: string[]
}

export async function createChatService(params: Params): Promise<string> {
  const { name, userIds } = params

  const createdGroupchat = await ChatAppDb.collection('chats').insertOne({
    name,
    userIds: userIds,
  })

  return createdGroupchat.insertedId.toString()
}
