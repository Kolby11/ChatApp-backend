import { Server, Socket } from 'socket.io'
import jwt from 'jsonwebtoken'
import { onSendMessage } from '../api/auth/chat/sendMessage/sendMessageController'

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET ? process.env.ACCESS_TOKEN_SECRET : ''

export let userSockets: Record<string, string> = {}

export function setupSocketListeners(io: Server) {
  io.on('connection', socket => {
    const token = socket.handshake.headers.authorization

    if (!token) {
      console.log('No token provided')
      socket.disconnect()
      return
    }

    jwt.verify(token, accessTokenSecret, (err, decoded) => {
      if (err || typeof decoded === 'string') {
        console.log('JWT verification failed:', err)
        socket.disconnect()
        return
      }
      if (!decoded) {
        throw new Error()
      }

      const userId = decoded.userId
      console.log('user connected:', userId)
      userSockets[userId] = socket.id
      socket.data.user = decoded

      // Remove mapping on disconnect
      socket.on('disconnect', () => {
        delete userSockets[userId]
        console.log('user disconnected')
      })
    })

    socket.on('sendMessage', data => {
      data = JSON.parse(data)
      onSendMessage(socket, { ...data, userId: socket.data.user.userId })
    })

    socket.on('start-call', data => {
      console.log('start-call', data)
      io.to(userSockets[data.receiverId]).emit('start-call', data)
    })
  })
}
