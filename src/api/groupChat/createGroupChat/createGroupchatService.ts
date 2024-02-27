import { ChatAppDb } from '../../../utils/mongodb'

type Params = {
  name: string
  userIds: string[]
}

export async function createGroupchatService(params: Params): Promise<string> {
  const { name, userIds } = params

  const createdGroupchat = await ChatAppDb.collection('groupchat').insertOne({
    name,
    $addToSet: { userIds: { $each: userIds } },
  })

  return createdGroupchat.insertedId.toString()
}
