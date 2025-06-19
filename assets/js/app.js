import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth } from "../../firebase-config.js";

// DOM Elements
const userNameElement = document.getElementById("user-name");
const logoutBtn = document.getElementById("logout-btn");
const sectionTitle = document.getElementById("section-title");
const chatArea = document.getElementById("chat-area");
const inputField = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");

// Welcome Message
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("keizer-user"));
  if (user) {
    userNameElement.textContent = user.email;
    displayBotMessage("I am Keizer, your AI assistant. How can I help you today?");
  } else {
    window.location.href = "index.html";
  }
});

// Logout
logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("keizer-user");
    window.location.href = "index.html";
  } catch (error) {
    alert("Error signing out: " + error.message);
  }
});

// Navigation
const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const target = e.target.getAttribute("data-tool");
    sectionTitle.textContent = target.charAt(0).toUpperCase() + target.slice(1);
    loadTool(target);
  });
});

// Load Tool Scripts
function loadTool(tool) {
  const toolScriptMap = {
    "chat": null,
    "research": "assets/js/ai/research.js",
    "writing": "assets/js/ai/writing.js",
    "settings": null
  };

  if (toolScriptMap[tool]) {
    import(`../../${toolScriptMap[tool]}`)
      .then(module => {
        if (module.initTool) module.initTool();
      })
      .catch(err => console.error("Tool load error:", err));
  }
}

// Chat - Basic AI Chat with OpenAI
sendBtn.addEventListener("click", async () => {
  const input = inputField.value.trim();
  if (!input) return;

  displayUserMessage(input);
  inputField.value = "";

  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "You are Keizer, a helpful assistant." },
          { role: "user", content: input }
        ]
      })
    });

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content || "No response.";
    displayBotMessage(message);
  } catch (error) {
    console.error("Chat error:", error);
    displayBotMessage("Sorry, something went wrong.");
  }
});

// Display Functions
function displayUserMessage(message) {
  const msg = document.createElement("div");
  msg.className = "message user-message";
  msg.textContent = message;
  chatArea.appendChild(msg);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function displayBotMessage(message) {
  const msg = document.createElement("div");
  msg.className = "message bot-message";
  msg.textContent = message;
  chatArea.appendChild(msg);
  chatArea.scrollTop = chatArea.scrollHeight;
}
