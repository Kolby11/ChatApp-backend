import expressWintson from 'express-winston'
import path from 'path'
import { cwd } from 'process'
import { transports, format, createLogger } from 'winston'

const logDir = path.join(cwd(), 'log')

export const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ level: 'warn', filename: path.join(logDir, 'warn.log') }),
    new transports.File({ level: 'error', filename: path.join(logDir, 'error.log') }),
  ],
  format: format.combine(format.json(), format.timestamp(), format.prettyPrint()),
})

// const apiFormat = format.printf(({ level, meta, timestamp }) => {
//   return `${timestamp} ${level} ${meta.message}`
// })

export const apiLogger = expressWintson.logger({
  transports: [
    new transports.File({ level: 'warn', filename: path.join(logDir, 'warn.log') }),
    new transports.File({ level: 'error', filename: path.join(logDir, 'error.log') }),
  ],
  format: format.combine(format.json(), format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss' }), format.prettyPrint()),
  statusLevels: true,
})

const errorFormat = format.printf(({ level, meta, timestamp }) => {
  return `${timestamp} ${level} ${meta.message}`
})

export const errorLogger = expressWintson.errorLogger({
  transports: [new transports.File({ filename: path.join(logDir, 'internalErrors.log') })],
  format: format.combine(format.json(), format.timestamp(), errorFormat),
})
