import express from 'express'
import { Server } from 'socket.io'
import http from 'http'
import credentials from './middleware/credentials'
import corsOptions from './config/corsOptions'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { errorHandler } from './middleware/errorHandler'
import { apiRouter } from './utils/apiRouter'
import 'dotenv/config'
import { mongo } from './utils/mongodb'
import { setupSocketListeners } from './utils/socketSetup'

// Environment variables
const port = process.env.PORT
const host = process.env.HOST

const app = express()

// Body parser middleware
app.use(express.json())

// Handle options credentials check - before CORS
// Fetch cookies middleware
app.use(credentials)

// Cors middleware
app.use(cors(corsOptions))

// Cookie parser middelware
app.use(cookieParser())

// Routes
// Attach api router
const router = apiRouter
app.use('/api/v1', router)

// Attach error handler
app.use(errorHandler)

// Create server
const server = http.createServer(app)

// Create socket.io server
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

mongo.connect()

setupSocketListeners(io)

server.listen(port, () => {
  console.log(`Server listening on http://${host}:${port}`)
})
