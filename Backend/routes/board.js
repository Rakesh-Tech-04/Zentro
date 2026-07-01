import e from 'express'
import { wrapAsync } from '../middleware/wrapAsync.js'
import { createBoard, deleteBoard, getBoard, getBoards, updateBoard } from '../controllers/board.js'
import { createList, getLists } from '../controllers/list.js'
import { createCard, getCards } from '../controllers/card.js'
import { authMiddleware } from '../middleware/jwt.js'
const router = e.Router()

// for boards

router
    .route('/')
    .get(authMiddleware, wrapAsync(getBoards))
    .post(authMiddleware, wrapAsync(createBoard))

router
    .route('/:boardId')
    .get(authMiddleware, wrapAsync(getBoard))
    .put(authMiddleware, wrapAsync(updateBoard))
    .delete(authMiddleware, wrapAsync(deleteBoard))

// for lists

router
    .route('/:boardId/lists')
    .get(wrapAsync(getLists))
    .post(authMiddleware, wrapAsync(createList))

// for cards

router
    .route('/:boardId/lists/:listId/cards')
    .post(authMiddleware, wrapAsync(createCard))

router
    .route('/:boardId/cards')
    .get(wrapAsync(getCards))


export default router