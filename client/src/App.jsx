import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io.connect("http://localhost:5000");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [joined, setJoined] = useState(false);

  const joinRoom = () => {
    if (username && room) {
      socket.emit("join_room", room);
      setJoined(true);
    }
  };

  const sendMessage = async () => {
    if (message !== "") {
      const messageData = {
        room: room,
        author: username,
        message: message,
        time: new Date().toLocaleTimeString(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      {!joined ? (
        <div>
          <h3>Join Chat</h3>
          <input type="text" placeholder="Name..." onChange={(e) => setUsername(e.target.value)} /><br /><br />
          <input type="text" placeholder="Room ID..." onChange={(e) => setRoom(e.target.value)} /><br /><br />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      ) : (
        <div>
          <h3>Room: {room} | User: {username}</h3>
          <div style={{ height: '300px', border: '1px solid #ccc', overflowY: 'scroll', marginBottom: '10px', padding: '10px' }}>
            {messageList.map((msg, index) => (
              <div key={index}>
                <strong>{msg.author}:</strong> {msg.message} <small>{msg.time}</small>
              </div>
            ))}
          </div>
          <input 
            type="text" 
            value={message} 
            placeholder="Hey..." 
            onChange={(e) => setMessage(e.target.value)} 
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}

export default App;
