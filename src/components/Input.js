import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
const Input = ({ socket }) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [room, setRoom] = useState(false);
  const [text, setText] = useState(null);
  //entering to the room
  const enterRoom = async () => {
    console.log("enter")
    await socket.emit("room-full");
    await socket.on("room-full", (data) => {
      if (data >= 4) {
        navigate("/", {
          state: {
            error: "Room is full",
          },
        });
      } else {
        if (text !== null) {
          setRoom(true);
        }
      }
    });
  };

  useEffect(() => {
    if (room) {
      socket.emit("join-room", { room: state.id, name: text });
      navigate(`/room/${state.id}`, {
        state: {
          name: text,
        },
      });
      setRoom(false);
    }
  }, [room,navigate,socket,state.id,text]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="pop-up"
        initial={{ x: "100vw", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        exit={{
          opacity: 0,
          x: "-100vw",
          transition: { duration: 1, delay: 0.1 },
        }}
      >
        <div className="name">
          <input
            type="text"
            placeholder="Enter your name"
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={() => enterRoom()}>Enter</button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Input;
