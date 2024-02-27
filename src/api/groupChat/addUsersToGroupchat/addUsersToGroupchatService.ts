import { ChatAppDb } from '../../../utils/mongodb'
import { ObjectId } from 'mongodb' // Import ObjectId
import { GroupchatTypes } from '../types'

type Params = {
  groupchatId: string
  userIds: string[]
}

export async function addUsersToGroupchatService(params: Params): Promise<Boolean> {
  const { groupchatId, userIds } = params

  const groupchatObjectId = new ObjectId(groupchatId)

  // Find the group chat
  const groupchat = await ChatAppDb.collection('groupchat').findOne({ _id: groupchatObjectId })

  // Check if the group chat exists
  if (!groupchat) {
    throw new GroupchatTypes.GroupChatNotFoundError(`Groupchat with id: ${groupchatId} does not exist`)
  }

  // Update the group chat document to add users
  const updatedGroupchat = await ChatAppDb.collection('groupchat').updateOne(
    { _id: groupchatObjectId },
    { $addToSet: { userIds: { $each: userIds } } } // Add userIds to the group chat
  )

  // Check if the update was successful
  return updatedGroupchat.modifiedCount > 0
}
