// src/App.js
import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import { auth } from './firebase';
import Signup from './Signup';
import './App.css';

import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';

const socket = io(process.env.REACT_APP_SERVER_URL);
 // 🔁 Change if deploying

function App() {
  const [msg, setMsg] = useState("");
  const [allMsg, setAllMsg] = useState([]);
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);


  useEffect(() => {
  const handleMessage = (data) => {
    setAllMsg(prev => [...prev, data]);
  };

  socket.on("receive-message", handleMessage);

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setUser(user);
  });

  // 🔥 Clean up the event listener when component unmounts
  return () => {
    socket.off("receive-message", handleMessage);
    unsubscribe(); // for auth listener cleanup
  };
}, []);


  const login = () => {
    const email = prompt("Enter Email:");
    const password = prompt("Enter Password:");
    signInWithEmailAndPassword(auth, email, password)
      .then(() => alert("Logged in successfully"))
      .catch(e => alert("Login failed: " + e.message));
  };

  const sendMsg = () => {
    if (msg.trim() === "") return;
    socket.emit("send-message", { text: msg, sender: user.email });
    setMsg("");
  };

if (!user) {
  return showSignup ? (
    <Signup onSignup={() => setShowSignup(false)} />
  ) : (
    <div style={{ padding: "20px" }}>
      <button onClick={login}>Login with Email</button>
      <p>or</p>
      <button onClick={() => setShowSignup(true)}>Create New Account</button>
    </div>
  );
}


  return (
    <div style={{ padding: "20px" }}>
      <h2>Welcome, {user.email}</h2>
      <button onClick={() => signOut(auth)}>Logout</button>
      <br /><br />
      <input
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="Type your message"
        style={{ padding: "5px", width: "300px" }}
      />
      <button onClick={sendMsg}>Send</button>
      <ul>
        {allMsg.map((m, i) => (
          <li key={i}><b>{m.sender}:</b> {m.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
