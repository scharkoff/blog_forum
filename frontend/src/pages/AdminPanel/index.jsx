import React from "react";

// -- Axios
import axios from "../../axios.js";

// -- Styles
import styles from "./AdminPanel.module.scss";

// -- Material UI
import { Avatar } from "@mui/material";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Typography } from "@mui/material";

// -- Table
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

// -- React-redux
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";

// -- Redux state
import {
  fetchUpdateUserAvatar,
  fetchUpdateUserEmail,
  fetchUpdateUserLogin,
  fetchUpdateUserPassword,
} from "../../redux/slices/auth.js";
import {
  fetchDeleteUser,
  fetchEditUserData,
  fetchUsers,
} from "../../redux/slices/users.js";

export const AdminPanel = () => {
  const dispatch = useDispatch();

  // -- Alert settings hooks
  const [open, setOpen] = React.useState(false);
  const [alertText, setAlertText] = React.useState("");
  const [alertType, setAlertType] = React.useState("info");

  // -- Auth user
  const user = useSelector((state) => state.auth.data);

  // -- All users from state
  const users = useSelector((state) => state?.users?.data);

  // -- Пользователи из базы данных
  const [rows, setRows] = React.useState(users);
  const [copyOfRows, setCopyOfRows] = React.useState([]);

  React.useEffect(() => {
    if (users) {
      setRows(
        users.map((user) => {
          return {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            rank: user.rank,
            created: user.createdAt.slice(0, 10),
          };
        })
      );

      setCopyOfRows(
        users.map((user) => {
          return {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            rank: user.rank,
            created: user.createdAt.slice(0, 10),
          };
        })
      );
    }
  }, [users]);

  React.useEffect(() => {
    dispatch(fetchUsers());
    document.title = "Админ панель";
  }, []);

  const columns = [
    { id: "id", label: "Id", minWidth: 20 },
    { id: "fullName", label: "Логин", minWidth: 100 },
    { id: "email", label: "Email", minWidth: 100 },
    { id: "created", label: "Дата создания", minWidth: 100 },
    { id: "rank", label: "Права", minWidth: 100 },
    { id: "buttons", label: "Управление", minWidth: 100 },
  ];

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const editUser = (id, login, email, rank) => {
    dispatch(fetchEditUserData({ id, login, email, rank }));
  };

  // -- Обработка клика по кнопке "Удалить"
  const deleteUser = async (id) => {
    if (
      window.confirm(
        "Вы действительно хотите удалить данного пользователя? Все его посты и комментарии будут также удалены навсегда!"
      )
    ) {
      const data = await dispatch(fetchDeleteUser(id));

      if (data.payload.isError) {
        setAlertText(
          data.payload.message ? data.payload.message : data.payload[0].msg
        );
        setOpen(true);
        setAlertType("error");
      } else {
        setAlertText("Пользователь успешно удален");
        setOpen(true);
        setAlertType("success");
      }
    }
  };

  // -- Поисковая строка
  const [searchText, setSearchText] = React.useState("");
  const getUsersLikeSearchText = (e) => {
    const words = e.target.value.toLowerCase();
    setSearchText(words);
    setRows(
      copyOfRows.filter(
        (row) =>
          row.fullName.startsWith(words) ||
          row.email.startsWith(words) ||
          row.rank.startsWith(words)
      )
    );
  };
  return (
    <div>
      <Alert
        style={{ display: !open ? "none" : "flex", marginBottom: 20 }}
        severity={alertType}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              setOpen(false);
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {alertText}
      </Alert>
      <Typography variant="h4" gutterBottom>
        Таблица всех пользователей
      </Typography>
      <TextField
        variant="standard"
        classes={{ root: styles.search }}
        id="search"
        label="Поиск"
        value={searchText}
        onChange={(e) => getUsersLikeSearchText(e)}
      />
      <Paper elevation={0} sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {(rows ? rows : [])
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column, i) => {
                        const value = row[column.id];
                        return row.id !== user?._id ? (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}

                            {i === 5 ? (
                              <div key={column.id}>
                                <Link
                                  key={column.id}
                                  to={`/admin-panel/edit-user/${row.id}`}
                                  style={{ textDecoration: "none" }}
                                >
                                  <Button
                                    onClick={() =>
                                      editUser(
                                        row.id,
                                        row.fullName,
                                        row.email,
                                        row.rank
                                      )
                                    }
                                    color="primary"
                                  >
                                    Изменить
                                  </Button>
                                </Link>
                                <Button
                                  onClick={() => deleteUser(row.id)}
                                  color="error"
                                >
                                  Удалить
                                </Button>
                              </div>
                            ) : (
                              ""
                            )}
                          </TableCell>
                        ) : (
                          ""
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows ? rows.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={"Кол-во видимых строк:"}
          labelDisplayedRows={(from = page) =>
            `${from.from}-${from.to === -1 ? from.count : from.to} из ${
              from.count
            }`
          }
        />
      </Paper>
    </div>
  );
};
