import { Board } from "../models/board.js";
import { Card } from "../models/card.js";
import { List } from "../models/list.js";
import { ExpressError } from "../utils/ExpressError.js";

export const getBoards = async (req, res) => {
    let boards = await Board.find({ user: req.user.id })
    res.status(200).json(boards)
}

export const getBoard = async (req, res) => {
    let { boardId } = req.params
    let board = await Board.findById(boardId)
    if (board.user.toString() !== req.user.id) {
        throw new ExpressError(403, "You can't see this board")
    }
    res.status(200).json({ title: board.title, bg: board.bg })
}

export const createBoard = async (req, res) => {
    let { title, bg } = req.body
    if (!title || !bg) throw new ExpressError(400, 'Field is required')
    let newBoard = await Board.create({ title, bg, user: req.user.id })
    res.status(201).json({ message: `You create Board ${newBoard.title}`, board: { title: newBoard.title, bg: newBoard.bg } })
}

export const updateBoard = async (req, res) => {
    let { boardId } = req.params
    let board = await Board.findOneAndUpdate({ _id: boardId, user: req.user.id }, req.body, { returnDocument: "after" }).select("-user")
    res.status(200).json(board)
}

export const deleteBoard = async (req, res) => {
    let { boardId } = req.params
    let oldBoard = await Board.findById(boardId)
    if (oldBoard.user.toString() !== req.user.id) {
        throw new ExpressError(403, "You are not owner of this board")
    }
    await Card.deleteMany({ board: boardId })
    await List.deleteMany({ board: boardId })
    let board = await Board.findByIdAndDelete(boardId).select('-user')
    res.status(200).json(board)
}