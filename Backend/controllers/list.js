import { List } from "../models/list.js"
import { Card } from "../models/card.js"
import { ExpressError } from "../utils/ExpressError.js"

export const getLists = async (req, res) => {
    let { boardId } = req.params
    let lists = await List.find({ board: boardId, user: req.user.id }).select("-user")
    res.status(200).json(lists)
}

export const createList = async (req, res) => {
    let { title, bg } = req.body
    let { boardId } = req.params
    if (!title || !bg) throw new ExpressError(400, 'Field is required')
    let user = req.user.id
    let newList = await List.create({ title, bg, board: boardId, user })
    res.status(201).json({ title: newList.title, bg: newList.bg })
}

export const updateList = async (req, res) => {
    let { listId } = req.params
    let list = await List.findOneAndUpdate({ _id: listId, user: req.user.id }, req.body, { returnDocument: "after" }).select('-user')
    res.status(200).json(list)
}

export const deleteList = async (req, res) => {
    let { listId } = req.params
    let oldList = await List.findById(listId)
    let ownerId = req.user.id
    if (ownerId !== oldList.user.toString()) {
        throw new ExpressError(403, "You are not owner of this list")
    }
    await Card.deleteMany({ list: listId })
    let list = await List.findByIdAndDelete(listId).select('-user')
    res.status(200).json(list)
}