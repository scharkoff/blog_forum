import React from "react";
import axios from "../../axios.js";
import store from "../../redux/store.js";

// -- Material UI
import { Avatar } from "@mui/material";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

// -- Libs
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

export const Profile = () => {
  const { id } = useParams();

  const [login, setLogin] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");

  const user = useSelector((state) => state.auth.data);

  React.useEffect(() => {
    if (user) {
      setLogin(user.fullName);
      setEmail(user.email);
    }
  }, [user]);

  React.useEffect(() => {
    axios.get("/auth/me").then((res) => {
      return res.data;
    });
  }, []);
  return (
    <div>
      <Grid container spacing={1} justifyContent="center">
        <Grid item>
          <Avatar
            sx={{ width: 200, height: 200 }}
            src={user ? user.avatarUrl : ""}
          ></Avatar>
        </Grid>
      </Grid>

      <Grid container spacing={1} justifyContent="center" marginTop={2}>
        <Grid item>
          <Button variant="outlined" size="large">
            Изменить аватар
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={1} justifyContent="center" marginTop={2}>
        <Grid item>
          <TextField
            variant="outlined"
            placeholder="Логин"
            fullWidth
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
        </Grid>
      </Grid>

      <Grid container spacing={1} justifyContent="center" marginTop={2}>
        <Grid item>
          <TextField
            variant="outlined"
            placeholder="Почта"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Grid>
      </Grid>

      <Grid container spacing={1} justifyContent="center" marginTop={2}>
        <Grid item>
          <TextField
            variant="outlined"
            placeholder="Новый пароль"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Grid>
      </Grid>

      <Grid container spacing={1} justifyContent="center" marginTop={2}>
        <Grid item>
          <Button size="large" variant="contained">
            Сохранить изменения
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};
