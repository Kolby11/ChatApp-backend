import { ChatAppDb } from '../../../utils/mongodb'
import { UserTypes } from '../../user/types'
import { UserUtils } from '../../user/userUtils'
import { AuthUtils } from '../authUtils'

type Params = {
  username: string
  email: string
  password: string
}

export async function registerService(params: Params): Promise<boolean> {
  const { username, email, password } = params

  const hashedPassword = await AuthUtils.hashPassword(password)

  const data: UserTypes.CreateUser = {
    username,
    email,
    password: hashedPassword,
    profileImageName: '',
    refreshToken: '',
  }

  const isUnique = await UserUtils.isUserDataUnique(username, email)

  const res = await ChatAppDb.collection('users').insertOne(data)
  return Boolean(res)
}
