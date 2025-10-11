import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";

// register
export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role, address, cpf } = req.body;

    // checking if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Usuário já cadastrado. Faça p login para acessar o sistema.",
      });
    }

    // validating email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Este email não é valido, digite um email válido.",
      });
    }

    // checking password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Sua senha deve conter no mínimo 8 caracteres.",
      });
    }

    // hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    // creating new user
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      address,
      cpf,
    });

    await newUser.save();

    // generating token
    const token = jwt.sign(
      {
        userId: newUser._id,
        role: newUser.role,
        name: newUser.name,
      },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" }
    );

    // success register message
    return res.status(201).json({
      success: true,
      message: "Usuário registrado com sucesso!",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Error ao registar usuário: ", error.message, error.stack);
    return res.status(500).json({
      success: false,
      message: "Error no servidor. Tente novamente mais tarde.",
    });
  }
};

// login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // checking if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Usuário não existe. Faça o cadastro para acessar o sistema.",
      });
    }

    // checking password
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Seu email ou senha estão incorretos. Tente novamente.",
      });
    }

    // creating token
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        name: user.name,
      },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" }
    )

    return res.status(200).json({
      success: true,
      message: "Login efetuado com sucesso.", token
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Algo deu errado. Tente novamente.",
    });
  }
};

// logout
export const logout = async (req, res) => {
  try {
    // Note: JWT doesn't have a built-in logout; invalidate client-side token
    res
      .status(200)
      .json({ message: "Logout successful; please clear token client-side" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password_hash"); // Exclude password
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};