import mongoose from 'mongoose'

const boardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true
    },
    bg: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }
}, {
    timestamps: true
})

export const Board = mongoose.model("Board", boardSchema)