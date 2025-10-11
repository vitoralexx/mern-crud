import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./src/config/mongodb.js";
import taskRouter from "./src/routes/taskRoutes.js";
import userRouter from "./src/routes/userRoutes.js";
import authRouter from "./src/routes/authRoutes.js";

// app config
const app = express();

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use("/api/tasks", taskRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

// route test
app.get("/api", (req, res) => {
  res.status(200).json({ message: "Welcome to the MERN backend" });
});

// connect db and start server
connectDB().then(() => {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})
.catch((err) => {
  console.error("Failed to connect to MongoDB", err);
  process.exit(1);
});