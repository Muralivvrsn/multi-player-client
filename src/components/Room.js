import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
const Room = ({ socket }) => {
  const [text, setText] = useState({});
  const pageURL = window.location.href;
  const navigate = useNavigate();
  const [join, setJoined] = useState(false);
  const [disconnect, setDisconnect] = useState(false);
  const [game, setGame] = useState(false);
  const { state } = useLocation();
  const { id } = useParams();
  const [players, setPlayers] = useState([]);
  socket.on("joined", (data) => {
    console.log("JOINED", data);
    setPlayers(data.users);
    setText(data.user);
    setJoined(true);
  });
  // socket responses
  useEffect(() => {
    socket.on("player-out", (data) => {
      setPlayers(data.users);
      setText(data.user);
      setDisconnect(true);
    });
  }, [socket, players, text, join]);

  //enter the message room
  const enterTheGame = async () => {
    await socket.emit("message-room", id);
    await socket.on("room", (data) => {
      if (data >= 4) {
        setGame(true);
      } else {
        setGame(false);
      }
    });
  };

  //if user not a valid, return to the previous page
  useEffect(() => {
    if (state === null || state === undefined) {
      navigate("/room", {
        state: {
          id,
        },
      });
    }
  }, []);

  //navigate to the next page
  useEffect(() => {
    if (game && state !== null) {
      navigate(`/room/${id}/message`, {
        state: {
          name: state.name,
        },
      });
    }
  }, [game]);

  //notification of user enter or not
  useEffect(() => {
    setTimeout(() => {
      setJoined(false);
    }, 5000);
    setTimeout(() => {
      setDisconnect(false);
    }, 5000);
  }, [join, disconnect]);

  return (
    <div id="room">
      <div className={`${join ? "joined" : "d-none"}`}>
        {text &&
          state &&
          `${
            text.name === state.name
              ? "You entered the game"
              : `The player ${text.name} has entered the game`
          }`}
      </div>
      <ul className="players">
        {players.map((item, index) => (
          <li key={index} className={`player player-${index}`}>
            <span className="index">Player {index + 1}:</span>
            <strong>
              <em>{item.name}</em>
            </strong>
          </li>
        ))}
      </ul>
      <button className="start" onClick={() => enterTheGame()}>
        Start
      </button>
      <div className={`${disconnect ? "red" : "d-none"}`}>
        {text && `The player ${text.name} has exited the game.`}
      </div>
      <div>
        <p>{pageURL}</p>
        <button
          onClick={() => {
            navigator.clipboard.writeText(pageURL);
          }}
        >
          copy
        </button>
      </div>
    </div>
  );
};

export default Room;
