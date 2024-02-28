import { ObjectId } from 'mongodb';
import { ChatAppDb } from '../../../utils/mongodb'

type Params = {
  userId: ObjectId
}

export async function currentUserService(params: Params): Promise<any> {
  const { userId } = params
  const user = await ChatAppDb.collection("users").findOne({
    _id: new ObjectId(userId)
  })
  
  if (!user) {
    return null
  }

  const {password,...userWithoutPass} = user
  return userWithoutPass
}
