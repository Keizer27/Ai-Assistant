import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAUkBHViqyW2E173HJ0NSCrbq4Drw_g5-k",
  authDomain: "ai-assistant-d7b04.firebaseapp.com",
  projectId: "ai-assistant-d7b04",
  storageBucket: "ai-assistant-d7b04.appspot.com",
  messagingSenderId: "849656295219",
  appId: "1:849656295219:web:67eadb61dbca10c9389846"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };