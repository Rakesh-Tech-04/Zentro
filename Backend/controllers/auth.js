import { User } from "../models/user.js"
import { ExpressError } from "../utils/ExpressError.js"
import bcrypt from 'bcrypt'
import { generateToken } from "../utils/jwt.js"
import jwt from 'jsonwebtoken'
import { Token } from "../models/token.js"

export const signup = async (req, res) => {
    let { name, email, password } = req.body
    if (!name || !email || !password) return (400, 'All Fields are required')
    let user = await User.findOne({ email })
    if (user) throw new ExpressError(400, 'Email already exists')
    password = await bcrypt.hash(password, 10)
    let newUser = await User.create({ name, email, password })
    const payload = {
        id: newUser._id,
        name: newUser.name
    }

    let accesstoken = generateToken(payload, '15m')
    let refreshtoken = generateToken(payload, '1d')
    isValidToken(req, res)
    await Token.create({ user: newUser.id, refreshtoken })
    res.cookie('zentroToken', refreshtoken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 1000 * 60 * 60 * 24
    })
    res.status(201).json({ success: true, message: 'Welcome to Zentro', accesstoken, name: newUser.name })
}

export const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) throw new ExpressError(400, 'Invalid input')
    const user = await User.findOne({ email })
    if (!user) throw new ExpressError(400, 'User not found')
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new ExpressError(400, 'Password is wrong')
    const payload = {
        id: user._id,
        name: user.name
    }
    let accesstoken = generateToken(payload, '15m')
    let refreshtoken = generateToken(payload, '1d')

    await Token.create({ user: user.id, refreshtoken })
    // await Token.create({ user: user.id})
    isValidToken(req, res)
    res.cookie('zentroToken', refreshtoken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 1000 * 60 * 60 * 24
    })
    res.status(200).json({ success: true, message: "Welcome back to Zentro", accesstoken, name: user.name })
}

export const logout = async (req, res) => {
    isValidToken(req, res)
    res.clearCookie('zentroToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict'
    })
    res.status(200).json({ success: true, message: "You logged out" })
}

const isValidToken = async (req, res) => {
    try {
        let refreshtoken = req.cookies.zentroToken
        if (!refreshtoken) return
        jwt.verify(refreshtoken, process.env.JWT_SECRET_KEY)
        let token = await Token.findOneAndUpdate({ refreshtoken }, { isValid: false })
        return
    }
    catch {
        return
    }
}

export const refreshToken = async (req, res) => {
    try {
        let refreshtoken = req.cookies.zentroToken
        if (!refreshtoken) throw new ExpressError(401, "Token not found")
        let decode = jwt.verify(refreshtoken, process.env.JWT_SECRET_KEY)
        let token = await Token.findOne({ refreshtoken, isValid: true })

        console.log(refreshtoken)
        if (!token) throw new ExpressError(401, 'Invalid token')

        token.isValid = false
        await token.save()

        let payload = {
            id: decode.id,
            name: decode.name
        }
        let accesstoken = generateToken(payload, '15m')
        refreshtoken = generateToken(payload, '1d')

        await Token.create({ user: decode.id, refreshtoken })

        res.cookie('zentroToken', refreshtoken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 1000 * 60 * 60 * 24
        })
        return res.status(200).json({ success: true, accesstoken, name: decode.name })
    }
    catch {
        throw new ExpressError(401, 'Unauthorized')
    }
}

