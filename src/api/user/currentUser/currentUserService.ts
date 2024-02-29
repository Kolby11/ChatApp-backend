import { ObjectId } from 'mongodb'
import { ChatAppDb } from '../../../utils/mongodb'

type Params = {
  userId: string
}

export async function currentUserService(params: Params): Promise<any> {
  const { userId } = params

  const userObjectId = new ObjectId(userId)

  const user = await ChatAppDb.collection('users').findOne({
    _id: userObjectId,
  })

  if (!user) {
    return null
  }

  const { password, ...userWithoutPass } = user
  return userWithoutPass
}
