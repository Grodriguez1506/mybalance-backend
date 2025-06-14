import User from "../models/user.js";
import { validateRegister, validateRecovery } from "../helpers/validate.js";
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
  const id = req.user.id;

  try {
    const userFound = await User.findById(id);

    return res.status(200).json({
      status: "success",
      userFound,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      message: "Something went wrong",
    });
  }
};

const edit = async (req, res) => {
  const id = req.user.id;

  const { password, salary, currency } = req.body;

  let params = {};

  if (password) {
    const pwd = await bcrypt.hash(password, 10);
    params.password = pwd;
  }

  if (salary) {
    params.salary = salary;
  }

  if (currency) {
    params.currency = currency;
  }

  try {
    await User.findByIdAndUpdate(id, params, {
      new: true,
    });

    return res.status(200).json({
      status: "success",
      message: "User updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const logout = (req, res) => {
  res.clearCookie("refreshToken");

  return res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

const recoveryPassword = async (req, res) => {
  const { username, pwd } = req.body;

  if (!username && !pwd) {
    return res.status(400).json({
      status: "error",
      message: "There are mandatory fields",
    });
  }

  try {
    validateRecovery(pwd);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }

  try {
    const userFound = await User.findOne({ username });

    if (!userFound) {
      return res.status(404).json({
        status: "error",
        message: "Username doesn't exist",
      });
    }

    const password = await bcrypt.hash(pwd, 10);

    userFound.password = password;

    await userFound.save();

    return res.status(200).json({
      status: "success",
      message: "Password recovered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const loggedUser = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    return res.json({
      loggedIn: true,
    });
  }

  return res.json({
    loggedIn: false,
  });
};

export default {
  register,
  login,
  refresh,
  profile,
  edit,
  logout,
  recoveryPassword,
  loggedUser,
};
