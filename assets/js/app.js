// assets/js/app.js
import { generateResponse } from "./ai/api.js";

document.addEventListener("DOMContentLoaded", () => {
  const sendBtn = document.getElementById("send-btn");
  const userInput = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");

  if (sendBtn && userInput && chatBox) {
    sendBtn.addEventListener("click", async () => {
      const input = userInput.value.trim();
      if (!input) return;

      appendMessage("You", input);
      userInput.value = "";

      const loadingMsg = appendMessage("Keizer", "Thinking...");
      const reply = await generateResponse(input);

      loadingMsg.textContent = `Keizer: ${reply}`;
    });
  }
});

function appendMessage(sender, text) {
  const chatBox = document.getElementById("chat-box");
  const msg = document.createElement("div");
  msg.className = "mb-2 p-2 rounded shadow text-sm bg-white";
  msg.textContent = `${sender}: ${text}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}
