import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";

function App() {
  const [room, setRoom] = useState();
  // useEffect(()=>{
  //   const socket = io.connect("http://localhost:4000");
  //   socket.emit("message",{
  //     name:"Murali"
  //   })
  //   socket.emit('create-room');
  //   socket.on('create-room',(id)=>{
  //     console.log(`create room with id :${id}`);
  //     setRoom(room);
  //   })
  //   socket.emit('join-room',room);
  //   socket.on('joined-room',(data)=>{
  //     console.log(`message to the room ${room}`);
  //   })
  // })
  return <div className="App"></div>;
}

export default App;
