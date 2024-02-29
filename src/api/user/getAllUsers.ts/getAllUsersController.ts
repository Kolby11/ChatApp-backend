import { getAllUsersService } from './allUsersService'
import { NextFunction, Request, Response } from 'express'

export async function getAllUsersController(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await getAllUsersService()
    return res.status(200).json(users)
  } catch (err) {
    next(err)
  }
}
