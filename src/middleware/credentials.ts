import { NextFunction, Request, Response } from 'express'
import allowedOrigins from '../config/allowedOrigins'
import { z } from 'zod'

function credentials(req: Request, res: Response, next: NextFunction) {
  const RequestSchema = z.object({
    headers: z.object({
      origin: z.string().optional(),
    }),
  })

  try {
    const validatedData = RequestSchema.parse(req)
    const { origin } = validatedData.headers

    if (origin && allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin)
      res.header('Access-Control-Allow-Credentials', 'true')
    }

    next()
  } catch (error) {
    // Handle the validation error or other errors
    res.status(400).send('Invalid request')
  }
}

export default credentials
