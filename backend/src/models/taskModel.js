import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    materials: {
      type: String,
    },
    place: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    responsible: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["aguardando_início", "em_execução", "finalizada", "pendente", "parada"],
      default: "aguardando_início",
    },
    priority: {
      type: String,
      enum: ["alta", "média", "baixa"],
      default: "média",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;