import e from "express";
import { wrapAsync } from "../middleware/wrapAsync.js";
import { login, logout, refreshToken, signup } from "../controllers/auth.js";
import { authValidation } from "../middleware/authValidation.js";
const router = e.Router()

router.post('/signup', authValidation, wrapAsync(signup))
router.post('/login', wrapAsync(login))
router.delete('/logout', wrapAsync(logout))
router.get('/refreshtoken', wrapAsync(refreshToken))

export default router