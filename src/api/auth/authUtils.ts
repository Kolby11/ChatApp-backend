export namespace AuthUtils {
  export const usernameRegex = /^[a-zA-Z0-9]+$/
  export const specialCharacterRegex = /[!@#$%^&*()+-=[\]{};':"\\|,.<>/?]+/
  export const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
}
