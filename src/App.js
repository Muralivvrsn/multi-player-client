import "./App.css";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Input from "./components/Input";
import CreateRoom from "./components/CreateRoom";
import Room from "./components/Room";
import Message from "./components/Message";
import { Routes, Route } from "react-router-dom";
const socket = io.connect("http://localhost:4000");
function App() {
  const [text, setText] = useState([]);
  useEffect(() => {
    socket.on("joined", (data) => {
      text.push(data.name);
    });
  },[text]);
  return (
    <div className="App">
      <ul>{text.length !== 0 && text.map((data) => <li>{data}</li>)}</ul>
      <Routes>
        <Route path="/" exact element={<CreateRoom socket={socket} />}></Route>
        <Route path="/room" exact element={<Input socket={socket} />}></Route>
        <Route
          path="/room/:id"
          exact
          element={<Room socket={socket} />}
        ></Route>
        <Route path="/room/:id/message" exact element={<Message socket={socket}/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
