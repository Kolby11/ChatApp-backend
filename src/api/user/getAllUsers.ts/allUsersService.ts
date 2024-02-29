import { ChatAppDb } from '../../../utils/mongodb'
import { UserTypes } from '../types'

export async function getAllUsersService(): Promise<UserTypes.UserPublic[]> {
  const users = await ChatAppDb.collection('users')
    .find({}, { projection: { password: 0, refreshToken: 0 } })
    .toArray()

  return users as unknown as UserTypes.UserPublic[]
}
