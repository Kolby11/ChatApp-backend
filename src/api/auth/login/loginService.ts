import { ChatAppDb } from '../../../utils/mongodb'
import { UserTypes } from '../../user/types'
import { AuthUtils } from '../authUtils'

type Params = {
  usernameOrEmail: string
  password: string
}

export async function loginService(params: Params): Promise<{ refreshToken: string; accessToken: string } | null> {
  const { usernameOrEmail, password } = params

  let user = await ChatAppDb.collection('users').findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  })

  if (!user) {
    throw new UserTypes.UserNotFoundError(`User with username or email: ${usernameOrEmail} not found`)
  }

  const verified = await AuthUtils.verifyPassword(user._id, password)

  if (!verified) {
    return null
  }

  const refreshToken = await AuthUtils.generateRefreshToken(user._id)
  const accessToken = await AuthUtils.generateAccessToken(user._id)

  if (!refreshToken || !accessToken) {
    return null
  }

  await ChatAppDb.collection('users').updateOne({ _id: user._id }, { $set: { refreshToken } })

  return { refreshToken, accessToken }
}
