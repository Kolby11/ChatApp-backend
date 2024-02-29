export namespace ChatTypes {
  // Custom errors
  export class ChatNotFoundError extends Error {
    constructor(message?: string) {
      super(message)
      this.name = 'ChatNotFoundError'
    }
  }
}
