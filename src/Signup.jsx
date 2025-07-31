import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signup successful! You can now log in.");
      navigate("/login"); // Redirect to login
    } catch (error) {
      alert(error.message);
    }
  };

  const goBack = () => {
    navigate(-1); // Go to previous page
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <div className="card shadow">
        <div className="card-body">
          <h2 className="text-center mb-4">Create Account</h2>

          <form onSubmit={handleSignup}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
            </div>

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-success">
                Sign Up
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={goBack}>
                ⬅ Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
