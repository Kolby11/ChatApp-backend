import { Express } from 'express'
import createServer from './utils/server'

const app: Express = createServer()

const port = process.env.PORT
const host = process.env.HOST

try {
  app.listen(port, () => {
    console.log(`Server listening on http://${host}:${port}`)
  })
} catch (error) {
  console.error(error)
}
