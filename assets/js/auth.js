import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "../../firebase-config.js";

// DOM loaded
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const signupBtn = document.getElementById("signup-btn");
  const logoutBtn = document.getElementById("logout-btn");

  // Login
  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "dashboard.html";
      } catch (error) {
        displayError(error.message);
      }
    });
  }

  // Signup
  if (signupBtn) {
    signupBtn.addEventListener("click", async () => {
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        window.location.href = "dashboard.html";
      } catch (error) {
        displayError(error.message);
      }
    });
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await signOut(auth);
        window.location.href = "index.html";
      } catch (error) {
        console.error("Logout failed:", error);
      }
    });
  }

  // Auth state change handler
  onAuthStateChanged(auth, (user) => {
    const isLoginPage = window.location.pathname.includes("index.html");
    const isDashboard = window.location.pathname.includes("dashboard.html");

    if (user && isLoginPage) {
      window.location.href = "dashboard.html";
    }

    if (!user && isDashboard) {
      window.location.href = "index.html";
    }
  });
});

// Display error
function displayError(msg) {
  const errorBox = document.getElementById("error-msg");
  if (errorBox) {
    errorBox.textContent = msg;
    errorBox.classList.remove("hidden");
    setTimeout(() => {
      errorBox.textContent = "";
      errorBox.classList.add("hidden");
    }, 5000);
  }
}
