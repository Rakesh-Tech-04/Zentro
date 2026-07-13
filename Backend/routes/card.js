import e from "express";
import { wrapAsync } from "../middleware/wrapAsync.js";
import { deleteCard, updateCard } from "../controllers/card.js";
import { authMiddleware } from "../middleware/jwt.js";

const router = e.Router()

router
    .route("/:cardId")
    .put(authMiddleware, wrapAsync(updateCard))
    .delete(authMiddleware, wrapAsync(deleteCard))

export default router