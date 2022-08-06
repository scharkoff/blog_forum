import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import {registerValidation} from "./validations/auth.js";
import { validationResult } from "express-validator";
import UserModel from "./models/User.js";

mongoose
.connect("mongodb+srv://admin:12345@cluster0.kalpivn.mongodb.net/blog?retryWrites=true")
.then(() => {console.log("Successful connection to the database")})
.catch((err) => {console.log(err, "Connect error")})

const app = express();
app.use(express.json());

// -- Авторизация пользователей
app.post("/auth/login", async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email});

        if (!user) {
            return res.status(404).json({
                message: "Неверный логин или пароль!",
            })
        };

        const isValid = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        console.log(req.body.password, user._doc.passwordHash)
        console.log(isValid == true)

        if (!isValid) {
            return res.status(404).json({
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

        res.json({
            userData,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось авторизоваться!", error,
        });
    }
})

// -- Регистрация пользователей
app.post("/auth/register", registerValidation, async (req, res) => {
    
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

        res.json({
            userData,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось зарегистрироваться!", error,
        });
    }
});








app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log("server started");
})