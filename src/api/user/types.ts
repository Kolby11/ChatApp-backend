export namespace Usertypes {
  export type User = {
    id: string
    username: string
    email: string
    password: string
    profileImageName: string
  }
  export type UserPublic = Omit<User, 'password'>

  export type CreateUser = Omit<User, 'id'>
}
