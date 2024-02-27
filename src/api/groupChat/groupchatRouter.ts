import { Router } from 'express'
import { addUsersToGroupchatController } from './addUsersToGroupchat/addUsesrToGroupchatController'
import { createGroupchatController } from './createGroupChat/createGroupchatController'

export const groupchatRouter = Router()

groupchatRouter.route('/').post(createGroupchatController)
groupchatRouter.route('/:groupchatId').put(addUsersToGroupchatController)
