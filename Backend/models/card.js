import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    bg: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    list: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "List",
        required: true,
        index: true
    },
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
        required: true,
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
})

export const Card = mongoose.model("Card", cardSchema)