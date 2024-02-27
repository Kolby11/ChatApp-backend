import { ChatAppDb } from '../../utils/mongodb'
import { UserTypes } from './types'

export namespace UserUtils {
  export async function isUserDataUnique(username: string, email: string): Promise<boolean> {
    const usernameNotUnique = await ChatAppDb.collection('users').findOne({ username })
    if (usernameNotUnique) {
      throw new UserTypes.UsernameAlreadyExistsError(`Username: '${username}' already exists`)
    }

    const emailNotUnique = await ChatAppDb.collection('users').findOne({ email })
    if (emailNotUnique) {
      throw new UserTypes.EmailAlreadyExistsError(`Email: '${email}' already exists`)
    }

    return true
  }
}
