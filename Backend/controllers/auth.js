import { User } from "../models/user.js"
import { ExpressError } from "../utils/ExpressError.js"
import bcrypt from 'bcrypt'
import { generateToken } from "../utils/jwt.js"
import jwt from 'jsonwebtoken'
import { Token } from "../models/token.js"

export const signup = async (req, res, next) => {
    let { name, email, password } = req.body
    let user = await User.findOne({ email })
    if (user) throw new ExpressError(401, 'Email already exists')
    password = await bcrypt.hash(password, 10)
    let newUser = await User.create({ name, email, password })
    const payload = {
        id: newUser._id,
        name: newUser.name
    }

    let accesstoken = generateToken(payload, '15m')
    let newRefreshtoken = generateToken(payload, '1d')
    isValidToken(req, res, next)
    await Token.create({ user: newUser.id, refreshToken: newRefreshtoken })
    res.cookie('zentroToken', newRefreshtoken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 1000 * 60 * 60 * 24
    })
    res.status(201).json({ success: true, message: 'Welcome to Zentro', accesstoken, name: newUser.name })
}

export const login = async (req, res, next) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) throw new ExpressError(401, 'User not found')
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new ExpressError(400, 'Password is wrong')
    const payload = {
        id: user._id,
        name: user.name
    }
    let accesstoken = generateToken(payload, '15m')
    let newRefreshtoken = generateToken(payload, '1d')
    isValidToken(req, res, next)
    await Token.create({ user: user.id, refreshToken: newRefreshtoken })

    res.cookie('zentroToken', newRefreshtoken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 1000 * 60 * 60 * 24
    })
    res.status(200).json({ success: true, message: "Welcome back to Zentro", accesstoken, name: user.name })
}

export const logout = async (req, res, next) => {
    isValidToken(req, res, next)
    res.clearCookie('zentroToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict'
    })
    res.status(200).json({ success: true, message: "You logged out" })
}

export const getMe = async (req, res) => {
    let token = req.cookies.zentroToken
    if (!token) return res.status(200).json({ success: false })
    try {
        let decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
        res.status(200).json({ success: true, user: decode })

    }
    catch {
        res.status(200).json({ success: false })
    }

}

export const refreshToken = async (req, res, next) => {
    try {
        let refreshToken = req.cookies.zentroToken
        let decode = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY)
        let token = await Token.findOne({ refreshToken })
        if (token) {
            if (token.isValid) {
                token.isValid = false
                await token.save()
            }
            else {
                return next(new ExpressError(401, 'Invalid token'))
            }
        }
        else {
            return next(new ExpressError(401, 'Invalid token'))
        }
        let payload = {
            id: decode.id,
            name: decode.name
        }
        let accesstoken = generateToken(payload, '15m')
        let newRefreshtoken = generateToken(payload, '1d')

        await Token.create({ user: decode.id, refreshToken: newRefreshtoken })

        res.cookie('zentroToken', newRefreshtoken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 1000 * 60 * 60 * 24
        })
        return res.status(200).json({ success: true, accesstoken, name: decode.name })
    }
    catch {
        return next(new ExpressError(401, 'Unauthrized'))
    }
}

const isValidToken = async (req, res, next) => {
    try {
        let refreshToken = req.cookies.zentroToken
        if (!refreshToken) return
        jwt.verify(refreshToken, process.env.JWT_SECRET_KEY)
        let token = await Token.findOneAndUpdate({ refreshToken }, { isValid: false })
        return
    }
    catch {
        return
    }
}