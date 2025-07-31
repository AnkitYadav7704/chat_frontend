// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// ⛔ IMPORTANT: Replace the values below with your own from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyD21T4t-qdDG0ZG7y1ChJ1JrObiIPvI8js",
  authDomain: "real-time-chat-7704.firebaseapp.com",
  projectId: "real-time-chat-7704",
  appId: "1:20758733310:web:21c9751251364c2da6a0af"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
