// src/App.js
import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import { auth } from './firebase';
import Signup from './Signup';
import './App.css';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import Login from './Login';




// 👇 Initialize Socket connection
const socket = io(process.env.REACT_APP_SERVER_URL); // ⚠️ Change URL when deploying

function App() {

  const [msg, setMsg] = useState("");
  const [allMsg, setAllMsg] = useState([]);
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  // 👇 Back Button Function
  const goBack = () => {
    window.history.back();
  };

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

  if (!user) {
  return showSignup ? (
    <Signup onSignup={() => setShowSignup(false)} />
  ) : (
    <Login onLogin={() => {}} onSwitchToSignup={() => setShowSignup(true)} />
  );
}


  const sendMsg = () => {
    if (msg.trim() === "") return;
    socket.emit("send-message", { text: msg, sender: user.email });
    setMsg("");
  };

  // 👇 If not logged in
  if (!user) {
    return showSignup ? (
      <Signup onSignup={() => setShowSignup(false)} />
    ) : (
      <div className="container text-center mt-5">
        <h2 className="mb-4">Welcome to ChatApp 🚀</h2>
        <button className="btn btn-primary me-2" onClick={Login}>Login with Email</button>
        <p className="my-2">or</p>
        <button className="btn btn-success" onClick={() => setShowSignup(true)}>Create New Account</button>
      </div>
    );
  }

  // 👇 Logged-in UI
  return (
    
    <div className="container mt-5">
      {/* Top Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Welcome, <span className="text-primary">{user.email}</span></h3>
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={goBack}>⬅ Back</button>
          <button className="btn btn-danger" onClick={() => signOut(auth)}>Logout</button>
        </div>
      </div>

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
