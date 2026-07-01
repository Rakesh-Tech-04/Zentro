import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
        unique: true
    },
    isValid: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

// tokenSchema.index({ user: -1, refreshToken: -1 })
tokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 })

export const Token = mongoose.model("Token", tokenSchema)