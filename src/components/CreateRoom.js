import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const CreateRoom = ({ socket }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [id, setId] = useState(null);
  const [nextPage, setNextPage] = useState(false);

  //navigating to the next page
  useEffect(() => {
    if (nextPage) {
      navigate("/room", {
        state: {
          id,
        },
      });
    }
  }, [nextPage]);

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
    await socket.emit("room-full");
    await socket.on("room-full", (data) => {
      console.log(data);
      if (!data) {
        console.log("Room is full");
        setError("Room is full");
      }
    });
    if (error === null) {
      if (id !== null && id !== undefined && id !== "") {
        setError(null);
      } else {
        setError("Room Id is empty");
      }
    }
  };

  useEffect(() => {
    setTimeout(()=>{
      setError(null)
    },5000)
  }, [error]);

  return (
    <div className="create-room">
      <button onClick={() => createRoom()}>Create Room</button>
      <p className="or">or</p>
      <div className="">{error}</div>
      <div className="join-room">
        <input
          type="text"
          onChange={(e) => {
            setId(e.target.value);
          }}
        />
        <button onClick={() => joinRoom()}>Join room</button>
        <div className={`${error!=null ? "red" : "d-none"}`}>
        {error}
      </div>
      </div>
    </div>
  );
};

export default CreateRoom;
