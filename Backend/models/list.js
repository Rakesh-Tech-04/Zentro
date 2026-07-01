import mongoose from "mongoose";

const listSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    bg: {
        type: String,
        required: true
    },
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
        required: true,
        index:true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
})

export const List = mongoose.model("List", listSchema)