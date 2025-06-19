// assets/js/app.js

import { sendAIRequest } from "./ai/api.js";
import { runResearch } from "./ai/research.js";
import { writeProjectOrJournal } from "./ai/writing.js";

document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatOutput = document.getElementById("chat-output");
  const toolSelect = document.getElementById("tool-select");

  const welcomeMessage = document.getElementById("welcome-message");
  if (welcomeMessage) {
    welcomeMessage.innerText = "Welcome, I am KEIZER, your AI assistant 🤖";
  }

  if (chatForm) {
    chatForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const userInput = chatInput.value.trim();
      if (!userInput) return;

      // Show user message
      chatOutput.innerHTML += `<div class="text-right mb-2"><span class="inline-block bg-blue-200 p-2 rounded">${userInput}</span></div>`;
      chatInput.value = "";

      // Determine tool mode
      const selectedTool = toolSelect.value;

      try {
        let aiResponse;

        if (selectedTool === "chat") {
          aiResponse = await sendAIRequest([
            { role: "system", content: "You are KEIZER, a helpful AI assistant." },
            { role: "user", content: userInput }
          ]);
        } else if (selectedTool === "research") {
          aiResponse = await runResearch(userInput);
        } else if (selectedTool === "write-project") {
          aiResponse = await writeProjectOrJournal(userInput, "project");
        } else if (selectedTool === "write-journal") {
          aiResponse = await writeProjectOrJournal(userInput, "journal");
        } else {
          aiResponse = "Unknown tool selected.";
        }

        // Show AI response
        chatOutput.innerHTML += `<div class="text-left mb-4"><span class="inline-block bg-gray-100 p-2 rounded">${aiResponse}</span></div>`;
        chatOutput.scrollTop = chatOutput.scrollHeight;

      } catch (error) {
        chatOutput.innerHTML += `<div class="text-left text-red-500 mb-4">Error: ${error.message}</div>`;
      }
    });
  }
});
