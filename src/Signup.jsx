import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase'; // ✅ make sure this is correctly set

function Signup({ onSignup = () => {}, onBackToLogin = () => {} }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    try {
      setError('');
      if (!email || !password) {
        return setError("Email and password are required");
      }

      await createUserWithEmailAndPassword(auth, email, password);
      onSignup(); // 👉 after successful signup, go back or move to login
    } catch (err) {
      console.error("Signup Error:", err);
      setError(err.message || "Failed to sign up.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Create Account</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <label>Email</label>
        <input 
          type="email" 
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Enter your email"
        />
      </div>

      <div className="mb-3">
        <label>Password</label>
        <input 
          type="password" 
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Create a password"
        />
      </div>

      <div className="d-flex justify-content-between">
        <button className="btn btn-secondary" onClick={onBackToLogin}>
          ← Back to Login
        </button>
        <button className="btn btn-success" onClick={handleSignup}>
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default Signup;
