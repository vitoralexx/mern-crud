import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";

// get all users
export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).json({
      success: true,
      message: "Usuários encontrados com successo.",
      allUsers,
    });
  } catch (error) {
    console.error("getAllUsers error:", error);
    res.status(500).json({
      success: false,
      message: "Erro no servidor ao buscar usuários.",
      error: error.message,
    });
  }
};

// get a single user
export const getSingleUser = async (req, res) => {
  try {
    const singleUser = await User.findById(req.params.id);
    if (!singleUser)
      return res.status(404).json({
        success: false,
        message: "O usuário não foi encontrado",
      });
    res.status(200).json(
      {
        success: true,
        message: "Usuário encontrado com successo",
      },
      singleUser,
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// create new user
export const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      confirmEmail,
      phone,
      password,
      confirmPassword,
      role,
      status,
      tasksDescription,
      address,
      cpf,
      rg,
      cnh,
      expiresAt,
      category,
      files,
    } = req.body;

    if (
      (!name ||
        !email ||
        !confirmEmail ||
        !phone ||
        !password ||
        !confirmPassword ||
        !role ||
        !status,
      !tasksDescription,
      !address || !cpf || !rg || !cnh || !expiresAt || !category)
    ) {
      return res.status(400).json({
        success: false,
        message: "É necessário preencher todos os campos obrigatórios.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedConfirmPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      confirmEmail,
      phone,
      password: hashedPassword,
      confirmPassword: hashedConfirmPassword,
      role,
      status,
      tasksDescription,
      address,
      cpf,
      rg,
      cnh,
      expiresAt,
      category,
      files,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "Usuário cadastro com sucesso.",
      user: newUser,
    });
  } catch (error) {
    console.error("Erro ao criar usuário: ", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao criar usuário.",
    });
  }
};

// update user
export const updateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let updateData = { name, email, role };
    if (password) {
      updateData.password_hash = await bcrypt.hash(password, 10);
    }
    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get user stats
export const getUserStats = async (req, res) => {
  try {
    // get uset by id
    const userId = await User.findById(req.params.id);

    // group and count user per status
    const userStats = await User.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const counts = {
      ativo: 0,
      suspenso: 0,
      inativo: 0,
      demitido: 0,
    };

    const percentages = {
      ativo: 0,
      suspenso: 0,
      inativo: 0,
      demitido: 0,
    };

    // fill counts with real data
    userStats.forEach((stat) => {
      counts[stat._id] = stat.count;
    });

    // calculate total users
    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    const formattedUserStats = {
      ...counts,
      percentages: {
        ativo: total ? Math.round((counts.ativo / total) * 100) : 0,
        suspenso: total ? Math.round((counts.suspenso / total) * 100) : 0,
        inativo: total ? Math.round((counts.inativo / total) * 100) : 0,
        demitido: total ? Math.round((counts.demitido / total) * 100) : 0,
      },
    };

    res.status(200).json({
      success: true,
      formattedUserStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};