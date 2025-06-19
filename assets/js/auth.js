import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { firebaseConfig } from "../../firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Get Elements
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");

// Login
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = loginForm.email.value.trim();
    const password = loginForm.password.value.trim();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      localStorage.setItem("keizer-user", JSON.stringify(user));
      window.location.href = "dashboard.html";
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  });
}

// Signup
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = signupForm.email.value.trim();
    const password = signupForm.password.value.trim();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      localStorage.setItem("keizer-user", JSON.stringify(user));
      window.location.href = "dashboard.html";
    } catch (error) {
      alert("Signup failed: " + error.message);
    }
  });
}

// Optional: Redirect if already logged in
onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname;
  if (user && path.includes("index.html")) {
    window.location.href = "dashboard.html";
  }
});

export { auth };
