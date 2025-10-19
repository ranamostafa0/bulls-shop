import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        const result = await mongoose.connect(process.env.DB_URI, {
            serverSelectionTimeoutMS: 30000
        })

        console.log(result.models)
        console.log("Database connected successfully")
    } catch (error) {
        console.log("Failed to connect on database", error)
    }
}