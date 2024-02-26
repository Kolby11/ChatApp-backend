import multer, { MulterError } from 'multer'
import { z } from 'zod'

export type UploadedImage = {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  size: number
  destination?: string
  path?: string
  buffer: Buffer
}

export const MulterFileSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.string(),
  size: z.number(),
  destination: z.string().optional(),
  path: z.string().optional(),
  buffer: z.instanceof(Buffer),
})

const storage = multer.memoryStorage()
const multerUpload = multer({ storage })

export default multerUpload
