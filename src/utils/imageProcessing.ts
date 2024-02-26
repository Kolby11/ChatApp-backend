import sharp from 'sharp'
import crypto from 'crypto'
import { UploadedImage } from './multer'

type ImageData = {
  buffer: Buffer
  metadata: any
  name: string
}

class ImageProcessing {
  static async resizeImage(image: Buffer, width: number, height: number) {
    const { data, info } = await sharp(image)
      .resize({ height, width, fit: 'cover' })
      .toBuffer({ resolveWithObject: true })

    return { buffer: data, metadata: info }
  }

  static async compressImageToJpeg(image: Buffer, quality: number = 80) {
    const { data, info } = await sharp(image).jpeg({ quality }).toBuffer({ resolveWithObject: true })

    return { buffer: data, metadata: info }
  }

  static async optimizeImage(image: UploadedImage) {
    // Resize the image first
    const resized = await ImageProcessing.resizeImage(image.buffer, 1500, 1500)

    // Then compress the resized image
    const compressed = await ImageProcessing.compressImageToJpeg(resized.buffer, 80)

    return compressed
  }

  static async createPlaceholderImage(image: Buffer) {
    const resized = await sharp(image)
      .resize({ width: 20, height: 20, fit: 'contain' })
      .blur()
      .toBuffer({ resolveWithObject: true })

    // Then compress the resized image
    const compressed = await ImageProcessing.compressImageToJpeg(resized.data, 80)

    return compressed
  }

  static async randomImageName(bytes: number = 32) {
    return crypto.randomBytes(bytes).toString('hex')
  }

  static async generateDatabaseImages(
    file: UploadedImage
  ): Promise<{ normalImage: ImageData; placeholderImage: ImageData }> {
    // Optimize the original image
    const optimizedImage = await ImageProcessing.optimizeImage(file)

    // Generate random names
    const normalImageName = await ImageProcessing.randomImageName()
    const placeholderImageName = normalImageName + '_placeholder'

    // Create placeholder image
    const placeholderImage = await ImageProcessing.createPlaceholderImage(optimizedImage.buffer)

    return {
      normalImage: {
        buffer: optimizedImage.buffer,
        metadata: optimizedImage.metadata,
        name: normalImageName,
      },
      placeholderImage: {
        buffer: placeholderImage.buffer,
        metadata: placeholderImage.metadata,
        name: placeholderImageName,
      },
    }
  }
}

export default ImageProcessing
