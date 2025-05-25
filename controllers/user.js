import User from "../models/user.js";
import { validateRegister } from "../helpers/validate.js";
import bcrypt from "bcrypt";
import JWT from "../helpers/jwt.js";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      status: "error",
      message: "There are mandatory fields",
    });
  }

  const params = req.body;

  if (
    !params.firstname ||
    !params.lastname ||
    !params.username ||
    !params.password
  ) {
    return res.status(400).json({
      status: "error",
      message: "There are mandatory fields",
    });
  }

  try {
    validateRegister(params);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }

  try {
    const userFound = await User.findOne({ username: params.username });

    if (userFound) {
      return res.status(400).json({
        status: "error",
        message: "Username already exists",
      });
    }

    let pwd = await bcrypt.hash(params.password, 10);

    params.password = pwd;

    const newUser = User(params);

    await newUser.save({ new: true });

    return res.status(200).json({
      status: "success",
      message: "Registered successfully",
      newUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const login = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      status: "error",
      message: "There are mandatory fields",
    });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      status: "error",
      message: "There are mandatory fields",
    });
  }

  try {
    const userFound = await User.findOne({ username }).select("+password -__v");

    if (!userFound) {
      return res.status(404).json({
        status: "error",
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch) {
      return res.status(404).json({
        status: "error",
        message: "Invalid credentials",
      });
    }

    const token = JWT.createAccessToken(userFound);
    const refreshToken = JWT.createRefreshToken(userFound);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // Expira en 7 días
    });

    return res.status(200).json({
      status: "success",
      message: "Logged in successfully",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const refresh = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(403).json({ message: "There's not refresh token" });
  }

  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        status: "error",
        message: "Expired token",
      });
    }

    const newToken = JWT.createNewToken(user);

    return res.json({
      status: "success",
      token: newToken,
    });
  });
};

const profile = async (req, res) => {
  const user = req.user;

  return res.status(200).json({
    status: "success",
    user,
  });
};

const setSalary = async (req, res) => {
  const id = req.user.id;

  if (!req.body) {
    return res.status(400).json({
      status: "error",
      message: "There are mandatory fields",
    });
  }

  const { salary, currency } = req.body;

  try {
    const userFound = await User.findById(id);

    userFound.salary = salary;
    userFound.currency = currency;

    await userFound.save();

    return res.status(200).json({
      status: "success",
      message: "Salary updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

export default {
  register,
  login,
  refresh,
  profile,
  setSalary,
};
