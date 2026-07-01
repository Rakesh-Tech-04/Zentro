import e from 'express'
import { wrapAsync } from '../middleware/wrapAsync.js'
import { createList, deleteList, getLists, updateList } from '../controllers/list.js'
import { createCard, getCards } from '../controllers/card.js'
import { authMiddleware } from '../middleware/jwt.js'

const router = e.Router()

router
    .route("/:listId")
    .put(authMiddleware, wrapAsync(updateList))
    .delete(authMiddleware, wrapAsync(deleteList))

export default router