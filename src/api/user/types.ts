export namespace UserTypes {
  export type User = {
    id: string
    username: string
    email: string
    password: string
    profileImageName: string
  }
  export type UserPublic = Omit<User, 'password'>

  export type CreateUser = Omit<User, 'id'>

  // Errors
  export class UserNotFoundError extends Error {
    constructor(message?: string) {
      super(message)
      this.name = 'UserNotFoundError'
    }
  }
}
