import express from 'express';
import connectDB from './db.js';
import userRoutes from  "./router/user.routers.js"
import promtRoutes from "./router/propt.routers.js"
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import cors from 'cors';

dotenv.config();
const port = process.env.PORT || 4001;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use( cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }))

// DATABASE
connectDB();

// ROUTES 
app.use("/api", userRoutes);
app.use("/api",promtRoutes)

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Server run successfully!" });
});


app.listen(port, () => {
  console.log("Server run successfully!");
});