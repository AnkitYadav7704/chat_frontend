// src/App.js
import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import { auth } from './firebase';
import Signup from './Signup';
import './App.css';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './Login';

// Initialize Socket connection
const socket = io(process.env.REACT_APP_SERVER_URL); // Change for deployment

function App() {
  const [msg, setMsg] = useState("");
  const [allMsg, setAllMsg] = useState([]);
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  // Listen for incoming messages and auth state
  useEffect(() => {
    const handleMessage = (data) => {
      setAllMsg(prev => [...prev, data]);
    };

    socket.on("receive-message", handleMessage);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => {
      socket.off("receive-message", handleMessage);
      unsubscribe();
    };
  }, []);

  const sendMsg = () => {
    if (msg.trim() === "") return;
    socket.emit("send-message", { text: msg, sender: user.email });
    setMsg("");
  };

  // Not logged in
  if (!user) {
    return showSignup ? (
      <Signup onSignup={() => setShowSignup(false)} />
    ) : (
      <Login onLogin={() => setShowSignup(false)} onSwitchToSignup={() => setShowSignup(true)} />
    );
  }

  // Logged-in UI
  return (
    <div className="container mt-5">
      {/* Message Input */}
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Type your message"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button className="btn btn-primary" onClick={sendMsg}>Send</button>
      </div>

      {/* Message List */}
      <div className="card shadow">
        <div className="card-header bg-primary text-white">💬 Chat Messages</div>
        <ul className="list-group list-group-flush">
          {allMsg.map((m, i) => (
            <li key={i} className="list-group-item">
              <strong>{m.sender}</strong>: {m.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
