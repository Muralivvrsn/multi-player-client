import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Input = ({ socket }) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [nextPage, setNextPage] = useState(false);
  const [text, setText] = useState(null);
  const [users, setUsers] = useState(null)



  //entering to the room
  const enterRoom = async() => {
    if(text!==null){
      socket.emit("join-room", {
        name: text,
        room: state.id,
      });
      setNextPage(true);
    }
  };


  //Navigate to the next page
  useEffect(()=>{
    if(nextPage){
      navigate(`/room/${state.id}`,{state:{
        name:text
      }})
    }
  },[nextPage]);



  return (
    <div className="pop-up">
      <div className="name">
        <input
          type="text"
          placeholder="Enter your name"
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={() => enterRoom()}>Enter</button>
      </div>
    </div>
  );
};

export default Input;
