import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    confirmEmail: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "gestor", "fiscal", "colaborador"],
      required: true,
    },
    tasksDescription: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["ativo", "suspenso", "inativo", "demitido"],
      default: "ativo",
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    cpf: {
      type: String,
      required: true,
    },
    rg: {
      type: String,
      required: true,
    },
    cnh: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    files: [{}],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const User = mongoose.model("User", userSchema);

export default User;