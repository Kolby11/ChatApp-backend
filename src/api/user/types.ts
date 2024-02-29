export namespace UserTypes {
  export type User = {
    _id: string
    username: string
    email: string
    password: string
    profileImageName: string
    refreshToken: string
  }
  export type UserPublic = Omit<User, 'password' | 'refreshToken'>

  export type CreateUser = Omit<User, '_id'>

  // Errors
  export class UserNotFoundError extends Error {
    constructor(message?: string) {
      super(message)
      this.name = 'User not found'
    }
  }

  export class UserConflictError extends Error {
    constructor(message?: string) {
      super(message)
      this.name = 'User constraint error'
    }
  }

  export class UsernameAlreadyExistsError extends UserConflictError {
    constructor(message?: string) {
      super(message)
      this.name = 'Username already exists'
    }
  }

  export class EmailAlreadyExistsError extends UserConflictError {
    constructor(message?: string) {
      super(message)
      this.name = 'Email already exists'
    }
  }
}
