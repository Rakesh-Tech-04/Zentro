import jwt from 'jsonwebtoken'

export const generateToken = (payload, expiry) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: expiry })
}