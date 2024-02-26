import { randomUUID } from 'crypto'
import { Usertypes } from './../../user/types'
import { ChatAppDb, mongo } from '../../../utils/mongodb'

type Params = {
  username: string
  email: string
  password: string
}

export async function registerService(params: Params): Promise<Boolean> {
  const data: Usertypes.CreateUser = { profileImageName: '', ...params }

  const res = await ChatAppDb.collection('users').insertOne(data)
  return Boolean(res)
}
