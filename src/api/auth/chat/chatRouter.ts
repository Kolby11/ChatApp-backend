import { Router } from 'express'
import { createChatController } from './createChat/createChatController'
import { addUsersToChatController } from './addUsersToChat/addUsersToController'
import { getChatDetailController } from './getChatDetail/getChatDetailController'
import { verifyJWT } from '../../../middleware/verifyJWT'
import { getMyChatsController } from './getMyChats/getMyChatsController'

export const chatRouter = Router()

chatRouter.route('/myChats').get(verifyJWT, getMyChatsController)
chatRouter.route('/:chatId').get(verifyJWT, getChatDetailController)
chatRouter.route('/').post(verifyJWT, createChatController)
chatRouter.route('/:chatId').put(verifyJWT, addUsersToChatController)
