import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { UserTypes } from '../api/users/types'
import { AuthTypes } from '../api/auth/types'
import { RecipeTypes } from '../api/recipes/types'
import { RecipeBookTypes } from '../api/recipeBooks/types'

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({ message: err.flatten() })
  } else if (
    err instanceof RecipeTypes.RecipeNotFoundError ||
    err instanceof UserTypes.UserNotFoundError ||
    err instanceof RecipeBookTypes.RecipeBookNotFoundError
  ) {
    res.status(404)
  } else if (
    err instanceof RecipeBookTypes.RecipeAlreadyInRecipeBookError ||
    err instanceof RecipeBookTypes.RecipeNotInRecipeBookError ||
    err instanceof RecipeBookTypes.RecipeBookNotUniquePerUserError ||
    err instanceof RecipeTypes.RecipeNameNotUniquePerUserError
  ) {
    res.status(400)
  } else if (err instanceof AuthTypes.UserNotAuthorizedError) {
    res.status(401)
  } else {
    // It's a 500 Internal Server Error if none of the above
    return res.sendStatus(500)
  }
  return res.json({ message: err.message })
}
