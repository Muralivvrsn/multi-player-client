import "./App.css";
import React from "react";
import io from "socket.io-client";
import Input from "./components/Input";
import CreateRoom from "./components/CreateRoom";
import Room from "./components/Room";
import Message from "./components/Message";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
const socket = io.connect("http://localhost:4000");
function App() {
  const location = useLocation();
  return (
    <div className="App">
        <AnimatePresence mode="wait">
        <Routes location={location} key={location.key}>
          <Route
            // key="createRoom"
            path="/"
            exact
            element={<CreateRoom socket={socket} />}
          ></Route>
          <Route
            // key="input"
            path="/room"
            exact
            element={<Input socket={socket} />}
          ></Route>
          <Route
            // key="room"
            path="/room/:id"
            exact
            element={<Room socket={socket} />}
          ></Route>
          <Route
            // key="message"
            path="/room/:id/message"
            exact
            element={<Message socket={socket} />}
          ></Route>
        </Routes>
        </AnimatePresence>
    </div>
  );
}

export default App;
