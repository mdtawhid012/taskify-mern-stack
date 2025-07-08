import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Connected to DataBase ${conn.connection.host}`)
    } catch (e) {
        console.log(`Failed to connect to DB ${e.message}`)
    }
}

export default connectDB;