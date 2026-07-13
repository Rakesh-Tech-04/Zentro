import { Card } from "../models/card.js"
import { ExpressError } from "../utils/ExpressError.js"

export const getCards = async (req, res) => {
    let { boardId } = req.params
    let cards = await Card.find({ board: boardId, user: req.user.id })
    res.status(200).json(cards)
}

export const createCard = async (req, res) => {
    let { title, bg, description } = req.body
    if (!title || !bg) throw new ExpressError(400, 'Field must be required')
    let { listId, boardId } = req.params
    let user = req.user.id
    let card = await Card.create({ title, bg, description, list: listId, board: boardId, user })
    res.status(201).json({ title: card.title, bg: card.bg, board: card.board, list: card.list })
}

export const updateCard = async (req, res) => {
    let { cardId } = req.params
    let card = await Card.findOneAndUpdate({ _id: cardId, user: req.user.id }, req.body, { returnDocument: "after" }).select("-user")
    res.status(200).json(card)
}

export const deleteCard = async (req, res) => {
    let { cardId } = req.params
    let card = await Card.findOneAndDelete({ _id: cardId, user: req.user.id }).select('-user')
    res.status(200).json(card)
}