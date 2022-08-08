// -- Плагины
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

// -- Модели
import UserModel from "../models/User.js";


// -- Регистрация пользователя
export const register = async (req, res) => {
    
    // -- Отслеживание ошибок
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }

    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const phash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: phash,
        });

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id,
            }, 
            "secrethash123",
            {
                expiresIn: "30d",
            }
        )

        const {passwordHash, ...userData} = user._doc;

        return res.json({
            userData,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Не удалось зарегистрироваться!", error,
        });
    };
};

// -- Авторизация пользователя
export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email});

        if (!user) {
            return res.status(400).json({
                message: "Неверный логин или пароль!",
            })
        };

        const isValid = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        console.log(req.body.password, user._doc.passwordHash)
        console.log(isValid == true)

        if (!isValid) {
            return res.status(400).json({
                message: "Неверный логин или пароль!",
            })
        };

        const token = jwt.sign(
            {
                _id: user._id,
            }, 
            "secrethash123",
            {
                expiresIn: "30d",
            }
        );

        const {passwordHash, ...userData} = user._doc;

        return res.json({
            userData,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Не удалось авторизоваться!", error,
        });
    };
};

// -- Получить информацию о пользователе
export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден!"
            })
        };

        const {passwordHash, ...userData} = user._doc;

        return res.json(userData);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Что-то пошло не так!", error,
        });
    };
};