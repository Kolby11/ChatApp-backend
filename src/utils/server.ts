import cors from 'cors'
import express, { Express } from 'express'
import cookieParser from 'cookie-parser'
import apiRouter from './apiRouter'
import { apiLogger, errorLogger } from './logger'
import corsOptions from '../config/corsOptions'
import credentials from '../middleware/credentials'
import { errorHandler } from '../middleware/errorHandler'

function createServer(): Express {
  const app = express()

  // Body parser middleware
  app.use(express.json())

  // Handle options credentials chech - before CORS
  // Fetch cookies middleware
  app.use(credentials)

  // Cors middleware
  app.use(cors(corsOptions))

  // Cookie parser middelware
  app.use(cookieParser())

  // Loggers
  // Attach api logger
  app.use(apiLogger)

  // Custom middleware functions
  // app.use(handleApiError)

  // Routes
  // Attach api router
  const router = apiRouter
  app.use('/api/v1', router)

  // Attach error handler
  app.use(errorHandler)

  //Fix
  app.use(errorLogger)

  return app
}

export default createServer
