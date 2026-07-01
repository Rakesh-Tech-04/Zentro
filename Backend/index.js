import 'dotenv/config';
import e from "express";
import { main } from './utils/mongoose.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routes/auth.js';
import boardRouter from './routes/board.js';
import listRouter from './routes/list.js';
import cardRouter from './routes/card.js';

const app = e()

main()
app.use(cors({
    origin: process.env.FOR_DEVELOPMENT,
    credentials: true
}))
app.use(e.urlencoded({ extended: true }))
app.use(e.json())
app.use(cookieParser())

app.use('/api/auth', authRouter)
app.use("/api/boards", boardRouter)
app.use("/api/lists", listRouter)
app.use("/api/cards", cardRouter)

app.use((err, req, res, next) => {
    let statusCode = err.status || 500
    let message = err.message || 'Something went wrong'

    if (err.name === "CastError") {
        statusCode = 404;
        message = "Resource not found";
    }

    // Validation Error
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
            .map(val => val.message)
            .join(", ");
    }

    // Duplicate Key
    if (err.code === 11000) {
        statusCode = 400;
        message = "Duplicate field value entered";
    }
    console.log(message)

    res.status(statusCode).json({ success: false, message })
})

app.listen(process.env.PORT || 8080, () => {
    console.log("Program is running")
})

