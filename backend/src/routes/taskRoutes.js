//
import express from "express"
//
import { getAllTasks, getTaskById, createTask, updateTask, deleteTask, updateTaskStatus, updateChecklist, getTaskStats } from "../controllers/TaskController.js";
import { verifyToken } from "../middleware/auth.js";

const taskRouter = express.Router();

// get all tasks
taskRouter.get("/", verifyToken, getAllTasks);

// get task stats
taskRouter.get("/stats", verifyToken, getTaskStats);

// get task by id
taskRouter.get("/:id", verifyToken, getTaskById);

// create a new task
taskRouter.post("/", verifyToken, createTask);

// update task (general fields)
taskRouter.put("/:id", verifyToken, updateTask);

// update task status
taskRouter.patch("/:id/status", verifyToken, updateTaskStatus);

// update checklist
taskRouter.patch("/:id/checklist", verifyToken, updateChecklist);

// delete task
taskRouter.delete("/:id", verifyToken, deleteTask);

export default taskRouter;