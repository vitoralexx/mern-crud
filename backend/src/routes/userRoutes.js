//
import express from "express";
//
import { getAllUsers, getSingleUser, createUser, updateUser, deleteUser, getUserStats } from "../controllers/UserController.js";
import { verifyToken } from "../middleware/auth.js";

const userRouter = express.Router();

// get all users
userRouter.get("/", getAllUsers);

// get user stats
userRouter.get("/stats", getUserStats);

// get user by id
userRouter.get("/:id", getSingleUser);

// create new user
userRouter.post("/", createUser);

// update user
userRouter.patch("/:id", updateUser);

// delete user
userRouter.delete("/:id", verifyToken, deleteUser);

export default userRouter;