import { ChatAppDb } from '../../../../utils/mongodb'
import { ObjectId } from 'mongodb' // Import ObjectId
import { ChatTypes } from '../types'

type Params = {
  userId: string
  groupchatId: string
  userIds: string[]
}

export async function addUsersToChatService(params: Params): Promise<Boolean> {
  const { groupchatId, userIds } = params

  const groupchatObjectId = new ObjectId(groupchatId)

  // Find the group chat
  const groupchat = await ChatAppDb.collection('chats').findOne({ _id: groupchatObjectId })

  // Check if the group chat exists
  if (!groupchat) {
    throw new ChatTypes.ChatNotFoundError(`Groupchat with id: ${groupchatId} does not exist`)
  }

  // Update the group chat document to add users
  const updatedGroupchat = await ChatAppDb.collection('chats').updateOne(
    { _id: groupchatObjectId },
    { $addToSet: { userIds: { $each: userIds } } } // Add userIds to the group chat
  )

  // Check if the update was successful
  return updatedGroupchat.modifiedCount > 0
}
