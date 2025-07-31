import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

function Signup({ onSignup, onBackToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onSignup(); // move to login after successful signup
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create Account</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <label>Email</label>
        <input 
          type="email" 
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
        />
      </div>
      <div className="mb-3">
        <label>Password</label>
        <input 
          type="password" 
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
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
