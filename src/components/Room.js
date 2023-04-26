import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AiOutlineArrowRight } from "react-icons/ai";
const Room = ({ socket }) => {
  const [text, setText] = useState({});
  const [room, setRoom] = useState(false);
  const [chatRoom, setChatRoom] = useState(false);
  const navigate = useNavigate();
  const [join, setJoined] = useState(false);
  const [disconnect, setDisconnect] = useState(false);
  const { state } = useLocation();
  const { id } = useParams();
  const [players, setPlayers] = useState([]);

  // socket response
  useEffect(() => {
    if (state === null || state === undefined || state.name === null) {
      navigate("/room", {
        state: {
          id,
        },
      });
    }
    if (chatRoom) {
      navigate(`/room/${id}/message`, {
        state: {
          name: state.name,
        },
      });
    }
  }, [chatRoom,id,navigate,state]);

  useEffect(() => {
    const handleJoined = async (data) => {
      await setPlayers(data.users);
      setText(data.user);
      setJoined(true);
    };
    socket.on("joined", handleJoined);
    socket.on("player-out", (data) => {
      setPlayers(data.users);
      setText(data.user);
      setDisconnect(true);
    });
    socket.emit("full-room", id);
    socket.on("full-room", (data) => {
      if (data >= 4) {
        setRoom(true);
      } else {
        setRoom(false);
      }
    });
    socket.on("room", (data) => {
      setChatRoom(data);
    });
  }, [socket,id]);

  //enter the message room
  const enterTheGame = async () => {
    await socket.emit("message-room", id);
  };

  useEffect(() => {
    setTimeout(() => {
      setJoined(false);
    }, 5000);
    setTimeout(() => {
      setDisconnect(false);
    }, 5000);
  }, [join, disconnect]);

  return (
    <motion.div
      id="room"
      initial={{ opacity: 0, x: "100vw" }}
      animate={{ opacity: 1, x: "0", type: "spring" }}
      transition={{ duration: 0.5 }}
    >
      <div className={`${join ? "joined" : "d-none"}`}>
        {text &&
          state &&
          `${
            text.name === state.name
              ? "You entered the game"
              : `The player ${text.name} has entered the game`
          }`}
      </div>
      <div className="players">
        {players.map((item, index) => {
          return (
            <motion.div
              className={`player player-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: "100vw" }}
              transition={{ duration: 1 }}
            >
              <strong>
                <em>{item.name}</em>
              </strong>
            </motion.div>
          );
        })}
      </div>
      {room && (
        <motion.div
          className="start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          You can start the game now!!
          <button className="icons" onClick={() => enterTheGame()}>
            {<AiOutlineArrowRight className="icon" />}
          </button>
        </motion.div>
      )}
      {!room && (
        <motion.div
          className="start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          Not enough palyers!!
        </motion.div>
      )}
      <div className={`${disconnect ? "red" : "d-none"}`}>
        {text && `The player ${text.name} has exited the game.`}
      </div>
    </motion.div>
  );
};

export default Room;
