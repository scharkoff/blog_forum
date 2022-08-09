// -- Плагины
import express from "express";
import mongoose from "mongoose";
import multer from "multer";

// -- Валидации
import {registerValidation, loginValidation, postCreateValidation} from "./validations/validations.js";

// -- Контроллеры
import {register, login, getMe} from "./controllers/UserController.js";
import { create, getAll, getOne, remove, update } from "./controllers/PostController.js";

// -- Посредники
import checkAuth from "./utils/checkAuth.js";

// -- Подключене к БД
mongoose
.connect("mongodb+srv://admin:12345@cluster0.kalpivn.mongodb.net/blog?retryWrites=true")
.then(() => {console.log("Successful connection to the database")})
.catch((err) => {console.log(err, "Connect error")})

// -- Express app
const app = express();
app.use(express.json());

// -- Multer storage
const storage = multer.diskStorage({
    destination: (__, _, cb) => {
        cb(null, "uploads");
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

// -- Загрузить файл картинку
app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
    return res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

// -- Доступ к картинке
app.use("/uploads", express.static("uploads")); // -- GET запрос на получение статичного файла по его названию (с расширением)

// -- Авторизация пользователей
app.post("/auth/login", loginValidation, login);

// -- Регистрация пользователей
app.post("/auth/register", registerValidation, register);


// -- Получить информацию о профиле
app.get("/auth/me", checkAuth, getMe);


// -- CRUD для постов
app.post("/posts/create", checkAuth, postCreateValidation, create); // -- создать статью
app.get("/posts", getAll); // -- получить все статьи
app.get("/posts/:id", getOne); // -- получить одну статью по ее id
app.delete("/posts/:id", checkAuth, remove); // -- удалить статью по ее id
app.patch("/posts/:id", checkAuth, update) // -- обновить статью




app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    };

    console.log("server started");
});