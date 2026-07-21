import jwt from 'jsonwebtoken'
import { ExpressError } from '../utils/ExpressError.js';

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next(new ExpressError(403, 'Unauthorized'))
    const token = authHeader.split(" ")[1];

    if (!token) return next(new ExpressError(403, 'Unauthorized'))
    try {
        let decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decode;
        next()
    } catch {
        return next(new ExpressError(403, 'Unauthorized'))
    }

}