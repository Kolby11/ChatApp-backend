import { ChatAppDb } from '../../../utils/mongodb'
import { UserTypes } from '../../user/types'
import { AuthUtils } from '../authUtils'

type Params = {
  usernameOrEmail: string
  password: string
}

export async function loginService(params: Params): Promise<boolean> {
  const { usernameOrEmail, password } = params

  let user = await ChatAppDb.collection('users').findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  })

  if (!user) {
    throw new UserTypes.UserNotFoundError(`User with username or email: ${usernameOrEmail} not found`)
  }

  const verified = AuthUtils.verifyPassword(user._id, password)

  return verified
}
