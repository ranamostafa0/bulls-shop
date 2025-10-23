import path from "node:path"
import * as dotenv from "dotenv"
dotenv.config({ path: path.join('./src/config/.env.dev') })

import express from 'express'
import authController from './modules/auth/auth.controller.js'
import userController from "./modules/user/user.controller.js"
import productController from "./modules/product/product.controller.js"
import { connectDB } from './DB/connection.js'
import { globalErrorHandling } from './utils/response/response.js'

import cors from 'cors';
import rateLimit from 'express-rate-limit';

// max 2000 requests per 1hour for each IP per window
const limiter = rateLimit({
    windowMs: 60 * 60000,
    limit: 2000,
    message: { error: "Too many requests please try again later" },
    statusCode: 429
})

const bootstrap = async () => {
    const app = express()
    const port = process.env.PORT || 5000

    // DB
    await connectDB()

    // convert buffer data
    app.use(express.json())

    app.use(cors({ origin: "*" }));
    app.use(limiter);

    // app routing
    app.get("/", (req, res) => res.status(200).json({ message: "Welcome to Bulls Shop" }))

    app.use("/auth", authController)
    app.use("/user", userController)
    app.use("/product", productController)

    app.use("{/*dummy}", (req, res) => res.status(404).json({ message: "In-valid routing" }))

    // global error handling
    app.use(globalErrorHandling)

    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

export default bootstrap