import { loginUser, logout, singupUser } from "../controller/user.controllers.js";

import express from "express";

const router = express.Router()

router.post("/singup", singupUser)
router.post("/login",loginUser)
router.get("/logout",logout)

export default router;