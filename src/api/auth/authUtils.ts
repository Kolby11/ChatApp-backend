import jwt, { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { ChatAppDb } from '../../utils/mongodb'
import { ObjectId } from 'mongodb'
import { UserTypes } from '../user/types'

export namespace AuthUtils {
  export const usernameRegex = /^[a-zA-Z0-9]+$/
  export const specialCharacterRegex = /[!@#$%^&*()+-=[\]{};':"\\|,.<>/?]+/
  export const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

  const saltCost = process.env.SALT_COST ? parseInt(process.env.SALT_COST) : 10
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET ? process.env.ACCESS_TOKEN_SECRET : ''
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET ? process.env.REFRESH_TOKEN_SECRET : ''

  type AccessToken = JwtPayload & {
    userId: string
  }

  /** Hash password with bcrypt */
  export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, saltCost)
  }

  /** Verify password with bcrypt */
  export async function verifyPassword(userId: ObjectId, password: string): Promise<boolean> {
    const foundUser = await ChatAppDb.collection('users').findOne({
      _id: userId,
    })

    if (!foundUser) {
      return false
    }

    return await bcrypt.compare(password, foundUser.password)
  }

  /** Generate access token */
  export async function generateAccessToken(userId: ObjectId): Promise<string> {
    const user = await ChatAppDb.collection('users').findOne({
      _id: userId,
    })
    if (!user) throw new UserTypes.UserNotFoundError(`User with id: '${userId}' not found`)
    return jwt.sign({ userId: user.id }, accessTokenSecret, { expiresIn: '1d' })
  }

  /** Generate refresh token */
  export async function generateRefreshToken(userId: ObjectId): Promise<string> {
    const user = await ChatAppDb.collection('users').findOne({
      _id: userId,
    })
    if (!user) throw new UserTypes.UserNotFoundError(`User with id: '${userId}' not found`)
    const refreshToken = jwt.sign({ userId: user.id }, refreshTokenSecret, { expiresIn: '7d' })

    return refreshToken
  }

  /** Add refresh token to user */
  export async function addRefreshTokenToUser(userId: ObjectId, refreshToken: string): Promise<boolean> {
    const updatedUser = await ChatAppDb.collection('users').findOneAndUpdate(
      {
        _id: userId,
      },
      { refreshToken: refreshToken }
    )
    return Boolean(updatedUser)
  }

  /** Remove refresh token from user */
  export async function removeRefreshTokenFromUser(userId: ObjectId): Promise<boolean> {
    const updatedUser = await ChatAppDb.collection('users').findOneAndUpdate(
      {
        _id: userId,
      },
      { refreshToken: null }
    )
    return Boolean(updatedUser)
  }

  export async function getAccessToken(refreshToken: string): Promise<string | null> {
    // Check if the refresh token is in the user in the database
    const foundUser = await ChatAppDb.collection('users').findOne({ refreshToken: refreshToken })

    if (!foundUser) return null

    return new Promise((resolve, reject) => {
      jwt.verify(refreshToken, refreshTokenSecret, (err, decoded) => {
        if (err) {
          return resolve(null)
        }

        const decodedToken: AccessToken = decoded as AccessToken

        if (foundUser.id !== decodedToken.userId) {
          return resolve(null)
        }

        // Issue new access token
        const accessToken = jwt.sign({ userId: decodedToken.userId }, accessTokenSecret, { expiresIn: '1d' })

        resolve(accessToken)
      })
    })
  }
}
