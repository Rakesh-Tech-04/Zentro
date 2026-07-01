import { Card } from "../models/card.js"
import { ExpressError } from "../utils/ExpressError.js"

export const getCards = async (req, res) => {
    let { boardId } = req.params
    let cards = await Card.find({ board: boardId })
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
    let oldCard = await Card.findById(cardId)
    let ownerId = req.user.id
    if (ownerId !== oldCard.user.toString()) {
        throw new ExpressError(403, 'You are not onwer of this card')
    }
    let card = await Card.findByIdAndUpdate(cardId, req.body, { returnDocument: 'after' }).select('-user')
    res.status(200).json(card)
}

export const deleteCard = async (req, res) => {
    let { cardId } = req.params
    let oldCard = await Card.findById(cardId)
    let ownerId = req.user.id
    if (ownerId !== oldCard.user.toString()) {
        throw new ExpressError(403, 'You are not onwer of this card')
    }
    let card = await Card.findByIdAndDelete(cardId).select('-user')
    res.status(200).json(card)
}