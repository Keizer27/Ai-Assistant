import { AI_CONFIG } from '../ai-config.js';

const modal = document.getElementById('tool-modal');
const titleEl = document.getElementById('tool-title');
const historyEl = document.getElementById('chat-history');
const inputEl = document.getElementById('tool-input');
const sendBtn = document.getElementById('tool-send');
const closeBtn = document.getElementById('close-modal');

let currentTool = null;

window.openTool = (tool) => {
  currentTool = tool;
  titleEl.textContent = tool.replace('-', ' ').toUpperCase();
  historyEl.innerHTML = '';

  // ✅ Keizer introduces himself
  appendMessage('Keizer', "I'm Keizer, your AI assistant. How can I help you today?");
  
  inputEl.value = '';
  modal.classList.remove('hidden');
  inputEl.focus();
};

closeBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

sendBtn.addEventListener('click', async () => {
  const userText = inputEl.value.trim();
  if (!userText) return;

  appendMessage('You', userText);
  inputEl.value = '';
  const aiResponse = await callAI(currentTool, userText);
  appendMessage('Keizer', aiResponse);
});

function appendMessage(sender, text) {
  const el = document.createElement('div');
  el.className = sender === 'You' ? 'self-end bg-blue-200 p-2 rounded text-sm text-right' :
                                     'self-start bg-gray-200 p-2 rounded text-sm';
  el.textContent = `${sender}: ${text}`;
  historyEl.appendChild(el);
  historyEl.scrollTop = historyEl.scrollHeight;
}

async function callAI(tool, prompt) {
  const roleMap = {
    chat: "general assistant",
    research: "academic research assistant summarize with citations",
    writing: "creative writing assistant",
    image: null,
    summary: "summarizer",
    qa: "question answering assistant",
    translate: "translator",
    code: "code assistant"
  };

  let messages = [
    { role: "system", content: `You are Keizer, a ${roleMap[tool]}. Respond clearly.` },
    { role: "user", content: prompt }
  ];

  if (tool === 'image') {
    return "Image generation feature coming soon.";
  }

  const response = await fetch(AI_CONFIG.apiUrl, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${AI_CONFIG.apiKey}`
    },
    body: JSON.stringify({ model: AI_CONFIG.model, messages, temperature: 0.7 })
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "No response.";
}
