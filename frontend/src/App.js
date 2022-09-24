import React from "react";

// -- Material UI
import Container from "@mui/material/Container";

// -- Components
import { Header } from "./components";
import { Home, FullPost, Registration, AddPost, Login, Profile } from "./pages";

// -- React-redux
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";

// -- Redux state
import { fetchAuthMe } from "./redux/slices/auth";

function App() {
  // -- Redux dispatch
  const dispatch = useDispatch();

  // -- useEffect
  React.useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Registration />}></Route>
          <Route path="/posts/:id" element={<FullPost />}></Route>
          <Route path="/posts/:id/edit" element={<AddPost />}></Route>
          <Route path="/add-post" element={<AddPost />}></Route>
          <Route path="/tags/:name" element={<Home />}></Route>
          <Route path="/profile/:id" element={<Profile />}></Route>
        </Routes>
      </Container>
    </>
  );
}

export default App;
