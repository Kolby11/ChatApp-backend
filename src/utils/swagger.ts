import { Router } from 'express'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'CookSmart API',
      version: '0.1.0',
      description: 'This is REST API for CookSmart web application',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'CookSmart',
        url: 'https://cooksmart.com',
        email: 'info@email.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1/',
      },
    ],
  },
  apis: ['./src/api/**/*.yml'],
}

const swaggerSpec = swaggerJsdoc(options)

export function swaggerDocs(apiRouter: Router) {
  apiRouter.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
