import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAUkBHViqyW2E173HJ0NSCrbq4Drw_g5-k",
  authDomain: "ai-assistant-d7b04.firebaseapp.com",
  projectId: "ai-assistant-d7b04",
  storageBucket: "ai-assistant-d7b04.appspot.com",
  messagingSenderId: "849656295219",
  appId: "1:849656295219:web:67eadb61dbca10c9389846",
  measurementId: "G-9B37VLFK5B"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export function initAuth() {
  // Handle login form submission
  document.getElementById('login-btn')?.addEventListener('click', handleLogin);
  
  // Handle signup link
  document.getElementById('signup-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    handleSignup();
  });

  // Handle logout
  document.getElementById('logout-btn')?.addEventListener('click', handleLogout);

  // Check auth state
  onAuthStateChanged(auth, (user) => {
    if (user) {
      window.location.href = 'dashboard.html';
    } else if (window.location.pathname.includes('dashboard')) {
      window.location.href = 'index.html';
    }
  });
}

async function handleLogin() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorElement = document.getElementById('error-msg');

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    errorElement.textContent = getAuthErrorMessage(error.code);
    errorElement.classList.remove('hidden');
    setTimeout(() => errorElement.classList.add('hidden'), 5000);
  }
}

async function handleSignup() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorElement = document.getElementById('error-msg');

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    // Auto-login after signup
    await handleLogin();
  } catch (error) {
    errorElement.textContent = getAuthErrorMessage(error.code);
    errorElement.classList.remove('hidden');
    setTimeout(() => errorElement.classList.add('hidden'), 5000);
  }
}

async function handleLogout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
  }
}

function getAuthErrorMessage(code) {
  switch(code) {
    case 'auth/invalid-email': return 'Invalid email address';
    case 'auth/user-disabled': return 'Account disabled';
    case 'auth/user-not-found': return 'Account not found';
    case 'auth/wrong-password': return 'Incorrect password';
    case 'auth/email-already-in-use': return 'Email already in use';
    case 'auth/weak-password': return 'Password should be at least 6 characters';
    default: return 'Authentication failed. Please try again.';
  }
}
