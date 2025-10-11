//
import express from "express";
//
import { register, login } from "../controllers/AuthController.js";

const authRouter = express.Router();

// register
authRouter.post("/register", register);

// login
authRouter.post("/login", login)

export default authRouter;