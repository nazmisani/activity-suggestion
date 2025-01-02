import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./views/Login";
import Register from "./views/Register";
import BaseLayout from "./views/BaseLayout";
import Home from "./views/Home";
import AddProfile from "./views/AddProfile";
import EditProfile from "./views/EditProfile";
import ReadProfile from "./views/ReadProfile";
import Generate from "./views/Generate";
import Chat from "./views/chat";

import { io } from "socket.io-client";

const socket = io("http://localhost:8080", {
  autoConnect: false,
});

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<BaseLayout />}>
            <Route index element={<Home />} />
            <Route path="/profile-add" element={<AddProfile />} />
            <Route path="/profile-edit" element={<EditProfile />} />
            <Route path="/profile-read" element={<ReadProfile />} />
            <Route path="/generate-activity" element={<Generate />} />
            <Route path="/chat" element={<Chat socket={socket} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
