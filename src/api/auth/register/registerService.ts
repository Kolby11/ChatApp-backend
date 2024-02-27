import { ChatAppDb } from '../../../utils/mongodb'
import { UserTypes } from '../../user/types'

type Params = {
  username: string
  email: string
  password: string
}

export async function registerService(params: Params): Promise<Boolean> {
  const data: UserTypes.CreateUser = { profileImageName: '', ...params }

  const res = await ChatAppDb.collection('users').insertOne(data)
  return Boolean(res)
}
