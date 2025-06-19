import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

// Replace with YOUR Firebase config (get from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyAUkBHViqyW2E173HJ0NSCrbq4Drw_g5-k",
  authDomain: "ai-assistant-d7b04.firebaseapp.com",
  projectId: "ai-assistant-d7b04",
  storageBucket: "ai-assistant-d7b04.appspot.com",
  messagingSenderId: "849656295219",
  appId:"1:849656295219:web:67eadb61dbca10c9389846"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword };
