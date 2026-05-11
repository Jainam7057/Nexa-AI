import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const MONGO_URL = process.env.MONGO_URI;


async function connectDB() {
    try {
        await mongoose.connect(MONGO_URL)
        console.log("DB Connected successfully!")
    } catch (error) {
        console.log(error)
    }
    
}

export default connectDB;