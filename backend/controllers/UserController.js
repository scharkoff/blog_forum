// -- Плагины
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// -- Модели
import UserModel from "../models/User.js";

// -- Default avatar image
const defaultAvatar =
  "https://i.pinimg.com/originals/d4/08/30/d40830f2d3e2d6889db42feae14e1976.png";

// -- Регистрация пользователя
export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const phash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: defaultAvatar,
      passwordHash: phash,
    });

    const checkNewUserData = await UserModel.findOne({ email: req.body.email });
    if (checkNewUserData) {
      return res.status(400).json({
        message: "Данный аккаунт уже зарегистрирован!",
      });
    }

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secrethash123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    return res.json({
      userData,
      token,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Не удалось зарегистрироваться!",
      error,
    });
  }
};

// -- Авторизация пользователя
export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({
        message: "Неверный логин или пароль!",
      });
    }

    const isValid = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValid) {
      return res.status(400).json({
        message: "Неверный логин или пароль!",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secrethash123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    return res.json({
      userData,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Не удалось авторизоваться!",
      error,
    });
  }
};

// -- Получить информацию о пользователе
export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден!",
      });
    }

    const { passwordHash, ...userData } = user._doc;

    return res.json(userData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Что-то пошло не так!",
      error,
    });
  }
};

// -- Изменить логин пользователя
export const updateUserLogin = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndUpdate(req.body.id, {
      fullName: req.body.fullName,
    });

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден!",
      });
    }

    const { ...userData } = user._doc;

    return res.json({
      userData,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Что-то пошло не так!",
      error,
    });
  }
};

// -- Изменить пароль пользователя
export const updateUserPassword = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const phash = await bcrypt.hash(password, salt);

    const user = await UserModel.findByIdAndUpdate(req.body.id, {
      passwordHash: phash,
    });

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден!",
      });
    }

    const { passwordHash, ...userData } = user._doc;

    return res.json({
      userData,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Что-то пошло не так!",
      error,
    });
  }
};

// -- Изменить почту пользователя
export const updateUserEmail = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndUpdate(req.body.id, {
      email: req.body.email,
    });

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден!",
      });
    }

    const { ...userData } = user._doc;

    return res.json({
      userData,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Что-то пошло не так!",
      error,
    });
  }
};

// -- Изменить аватар пользователя
export const updateUserAvatar = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndUpdate(req.body.id, {
      avatarUrl: req.body.avatarUrl,
    });

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден!",
      });
    }

    const { ...userData } = user._doc;

    return res.json({
      userData,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Что-то пошло не так!",
      error,
    });
  }
};
