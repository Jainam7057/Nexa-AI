import express from "express";
import { sendPrompt } from "../controller/promt.controllers.js";
import userMiddleware from "../middleware/promt.middleware.js";


const router = express.Router()

router.post("/promt",userMiddleware, sendPrompt)


export default router;


