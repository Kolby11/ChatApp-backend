export namespace GroupchatTypes {
  // Custom errors
  export class GroupChatNotFoundError extends Error {
    constructor(message?: string) {
      super(message)
      this.name = 'GroupChatNotFoundError'
    }
  }
}
