import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
const Message = ({ socket }) => {
  const { id } = useParams();
  const { state } = useLocation();
  const [messageList, setMessageList] = useState([]);
  const [currentMessage, setMessage] = useState("");
  const sendMessage = async () => {
    const message = {
      room: id,
      author: state.name,
      message: currentMessage,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };
    await socket.emit("send_message", message);
    setMessage("");
  };
  useEffect(()=>{
    socket.on("recieved_message", (data) => {
        setMessageList((list) => [...list, data]);
      });
  },[socket]);

  return (
    <div className="message-room">
      <div className="messages">
        <div className="text-block">
          {messageList.map((message,index) => {
            return (
              <div
                className={`text ${
                  message.author === state.name ? " text-left" : " text-right"
                }player-${index}`}
              >
                <div className="text-message">{message.message}</div>
                <div className="text-time">{message.time}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="name message">
        <input
          type="text"
          placeholder="Type a message"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={() => sendMessage()}>send</button>
      </div>
    </div>
  );
};

export default Message;
