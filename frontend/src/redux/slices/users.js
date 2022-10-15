import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  try {
    const users = await axios.get("/users");
    return users;
  } catch (error) {
    console.log(error);
    return error;
  }
});

export const fetchEditUserData = createAsyncThunk(
  "users/fetchEditUserData",
  async (data) => {
    console.log(data);
    return data;
  }
);

export const fetchDeleteUser = createAsyncThunk(
  "users/fetchDeleteUser",
  async (id) => {
    try {
      const { data } = await axios.delete(`/users/delete/${id}`);
      return data;
    } catch (error) {
      return { ...error.response.data, isError: true };
    }
  }
);

const initialState = {
  data: null,
  status: "loading",
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: {
    // -- Получение всех пользователей
    [fetchEditUserData.fulfilled]: (state, action) => {
      state.editbleUserData = action.payload;
      state.status = "loaded";
    },

    // -- Получить данные
    [fetchUsers.pending]: (state) => {
      state.data = null;
      state.status = "loading";
    },
    [fetchUsers.rejected]: (state) => {
      state.data = null;
      state.status = "error";
    },
    [fetchUsers.fulfilled]: (state, action) => {
      state.data = action.payload.data;
      state.status = "loaded";
    },

    // -- Удаление пользователя
    [fetchDeleteUser.fulfilled]: (state, action) => {
      if (action.payload.success)
        state.data = state.data.filter((obj) => obj._id !== action.meta.arg);
    },
    [fetchDeleteUser.rejected]: (state) => {
      state.status = "error";
    },
  },
});

export const usersReducer = usersSlice.reducer;
