import 'dotenv/config'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { decode } from 'punycode'

export type RequestWithUser = Request & {
  userId?: ObjectId
}

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET ? process.env.ACCESS_TOKEN_SECRET : ''

export async function verifyJWT(req: RequestWithUser, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization']
  const accessTokenCookie = req.cookies.accessToken

  let token = ''

  if (authHeader) {
    token = authHeader.split(' ')[1]
  } else if (accessTokenCookie) {
    token = accessTokenCookie
  } else {
    return res.sendStatus(404)
  }

  jwt.verify(token, accessTokenSecret, (err, decoded) => {
    if (err) {
      return res.sendStatus(403)
    }

    if (typeof decoded === 'string') {
      return res.sendStatus(403)
    }
    if (!decoded) {
      throw new Error()
    }    
    console.log(decoded)
    console.log("ss:",req.body.userId = decoded.userId)
    next()
  })
}

export async function verifyOptionalJWT(req: RequestWithUser, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization']
  const accessTokenCookie = req.cookies.accessToken

  let token = ''

  if (authHeader) {
    token = authHeader.split(' ')[1]
  } else if (accessTokenCookie) {
    token = accessTokenCookie
  } else {
    return next()
  }

  jwt.verify(token, accessTokenSecret, (err, decoded) => {
    if (err) {
      return next()
    }

    if (typeof decoded === 'string') {
      return next()
    }
    if (!decoded) {
      throw new Error()
    }
    req.body.userId = decoded.userId
    next()
  })
}
