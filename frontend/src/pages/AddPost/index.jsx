import React from "react";

// -- Material UI
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

// -- Material UI simple editor
import SimpleMDE from "react-simplemde-editor";

// -- Styles
import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";

// -- React-redux
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

// -- Redux state
import { selectIsAuth } from "../../redux/slices/auth";

// -- Axios
import axios from "../../axios";

export const AddPost = () => {
  // -- Проверка на авторизацию
  const isAuth = useSelector(selectIsAuth);

  // -- Навигация rrd
  const navigate = useNavigate();

  // -- id поста
  const { id } = useParams();

  // -- useState
  const [text, setText] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [title, setTitle] = React.useState("");

  // -- useRef
  const inputFileRef = React.useRef(null);

  // -- Проверка на режим редактирования
  const isEditing = Boolean(id);

  // -- Загрузка изображения к посту
  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("image", file);
      const { data } = await axios.post("/upload", formData);
      setImageUrl(data.url);
    } catch (error) {
      console.error(error);
      alert("Не удалось загрузить изображение!");
    }
  };

  // -- useEffect
  React.useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setTitle(data.title);
          setText(data.text);
          setImageUrl(data.imageUrl);
          setTags(data.tags);
        })
        .catch((err) => {
          console.warn(err);
          alert("Ошибка при получении статьи!");
        });
    }
  }, []);

  // -- Functions
  // -- Обработка клика по кнопке "Удалить" картинку
  const onClickRemoveImage = () => {
    setImageUrl("");
  };

  // -- Обработка клика по кнопке "Опубликовать" пост
  const onSubmit = async () => {
    try {
      setLoading(true);
      const fields = {
        title,
        text,
        imageUrl,
        tags: Array.isArray(tags) ? tags : tags.replaceAll(" ", "").split(","),
      };

      console.log("new tags: ", tags);

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post("/posts/create", fields);

      const _id = isEditing ? id : data._id;
      navigate(`/posts/${_id}`);
    } catch (error) {
      console.error(error);
      alert("Ошибка при создании статьи!");
    }
  };

  // -- useCallback for simple editor
  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  // -- Опции для simple editor
  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  // -- Если не авторизировался, перебросить на главный экран
  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper elevation={0} style={{ padding: 30 }}>
      <Button
        onClick={() => inputFileRef.current.click()}
        variant="outlined"
        size="large"
      >
        Загрузить превью
      </Button>
      <input
        ref={inputFileRef}
        type="file"
        onChange={handleChangeFile}
        hidden
      />
      {imageUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            Удалить
          </Button>
          <img
            className={styles.image}
            src={`http://localhost:4444${imageUrl}`}
            alt="Uploaded"
          />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? "Сохранить" : "Опубликовать"}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
