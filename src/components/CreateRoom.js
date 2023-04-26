import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
const CreateRoom = ({ socket }) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [error, setError] = useState(null);
  const [id, setId] = useState(null);
  const [nextPage, setNextPage] = useState(false);

  //navigating to the next page
  useEffect(() => {
    if (nextPage) {
      navigate(`/room`, {
        state: {
          id,
        },
      });
    }
    if (state !== null) {
      setError(state.error);
    }
  }, [nextPage,id,navigate,state]);

  //create room function
  const createRoom = async () => {
    await socket.emit("create-room");
    await socket.on("room-id", (data) => {
      setId(data.id);
      setNextPage(true);
    });
  };

  //join room function
  const joinRoom = async () => {
    if (id !== null && id !== undefined && id !== "") {
      await socket.emit("room-full");
      await socket.on("room-full", (data) => {
        if (data >= 4) {
          setError("Room is full");
        } else {
          setNextPage(true);
        }
      });
    } else {
      setError("Room Id is empty");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setError(null);
    }, 5000);
  });

  return (
    <motion.div
      className="div-room"
      key="room"
      initial={{ opacity: 0, x: "100vw" }}
      animate={{ opacity: 1, x: 0, type: "spring" }}
      transition={{ delay: 0.1, duration: 1 }}
      exit={{ x: "-100vw", transition: { duration: 0.5 } }}
    >
      <div className="create-room">
        <button onClick={() => createRoom()}>Create Room</button>
        <p className="or">or</p>
        <div className="join-room">
          <input
            type="text"
            onChange={(e) => {
              setId(e.target.value);
            }}
          />
          <button onClick={() => joinRoom()}>Join room</button>
          <div className={`${error != null ? "red" : "d-none"}`}>{error}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateRoom;
