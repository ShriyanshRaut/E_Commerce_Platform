import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import errorMiddleware from "./middlewares/error.middleware.js"

const app = express()

app.use(errorMiddleware);

app.use(helmet())
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(cookieParser())

// health check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" })
})

export { app }