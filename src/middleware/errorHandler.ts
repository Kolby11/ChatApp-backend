import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({ message: err.flatten() })
  } else {
    // It's a 500 Internal Server Error if none of the above
    return res.sendStatus(500)
  }
  return res.json({ message: err.message })
}
