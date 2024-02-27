import { ChatAppDb } from '../../../utils/mongodb'

export async function logoutService(refreshToken: string): Promise<boolean> {
  const foundUser = await ChatAppDb.collection('users').findOneAndUpdate(
    { refreshToken: refreshToken },
    { $set: { refreshToken: '' } }
  )

  if (!foundUser) {
    return false
  }

  return true
}
