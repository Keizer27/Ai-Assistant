import { auth } from "../../firebase-config.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const signupLink = document.getElementById("signup-link");

  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        document.getElementById("error-msg").textContent = error.message;
      }
    });
  }

  if (signupLink) {
    signupLink.addEventListener("click", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        window.location.href = "dashboard.html";
      } catch (error) {
        document.getElementById("error-msg").textContent = error.message;
      }
    });
  }

  onAuthStateChanged(auth, user => {
    if (user && window.location.pathname.includes("index.html")) {
      window.location.href = "dashboard.html";
    } else if (!user && window.location.pathname.includes("dashboard.html")) {
      window.location.href = "index.html";
    }
  });
});
