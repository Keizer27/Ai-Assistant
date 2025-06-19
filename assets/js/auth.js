// assets/js/auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { firebaseConfig } from "../../firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// SET PERSISTENCE
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Persistence error:", error.message);
});

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const signupLink = document.getElementById("signup-link");
const errorMsg = document.getElementById("error-msg");

// LOGIN FUNCTION
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.location.href = "dashboard.html";
      })
      .catch((error) => {
        errorMsg.textContent = error.message;
      });
  });
}

// SIGNUP LINK - CREATE NEW ACCOUNT
if (signupLink) {
  signupLink.addEventListener("click", () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.location.href = "dashboard.html";
      })
      .catch((error) => {
        errorMsg.textContent = error.message;
      });
  });
}
