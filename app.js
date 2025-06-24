// --- Firebase Initialization ---
const firebaseConfig = {
  // TODO: Paste your firebaseConfig here
};
firebase.initializeApp(firebaseConfig);

// --- Sidebar Navigation Logic ---
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.tool-section');

function setActiveNav(tool) {
  navItems.forEach(item => {
    if (item.dataset.tool === tool) item.classList.add('active');
    else item.classList.remove('active');
  });
}

function showSection(tool) {
  sections.forEach(section => {
    if (section.id === `${tool}-section`) section.classList.remove('hidden');
    else section.classList.add('hidden');
  });
}

navItems.forEach(item => {
  item.addEventListener('click', () => {
    const tool = item.dataset.tool;
    setActiveNav(tool);
    showSection(tool);
    // Focus chat input when switching to chat
    if (tool === 'chat') setTimeout(() => document.getElementById('chat-input').focus(), 300);
  });
});

// --- Chat AI Logic ---
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');

function appendMessage(role, text) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-message ${role}`;
  // Avatar
  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.textContent = role === 'bot' ? 'X' : 'U';
  msgDiv.appendChild(avatar);
  // Bubble
  const span = document.createElement('span');
  span.className = 'bubble';
  span.textContent = text;
  msgDiv.appendChild(span);
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'chat-message bot typing';
  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.textContent = 'X';
  typingDiv.appendChild(avatar);
  const typingSpan = document.createElement('span');
  typingSpan.className = 'bubble';
  typingSpan.innerHTML = `<span class="typing-indicator">
    <span>.</span><span>.</span><span>.</span>
  </span>`;
  typingDiv.appendChild(typingSpan);
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
  const typingDiv = chatMessages.querySelector('.typing');
  if (typingDiv) typingDiv.remove();
}

// Show welcome message on open
function startChatWelcome() {
  chatMessages.innerHTML = '';
  setTimeout(() => {
    appendMessage('bot', "Hello! I'm Keizer, your AI assistant. How can I help you today?");
  }, 390);
}

startChatWelcome();

// Chat form submit
chatForm.addEventListener('submit', async e => {
  e.preventDefault();
  const input = chatInput.value.trim();
  if (!input) return;
  appendMessage('user', input);
  chatInput.value = '';
  showTypingIndicator();

  try {
    // --- Call Firebase Cloud Function as secure AI proxy ---
    const response = await fetch('/__/functions/aiProxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: input, history: [] }) // Optionally send chat history
    });
    const data = await response.json();
    removeTypingIndicator();
    if (data && data.text) {
      appendMessage('bot', data.text);
    } else {
      appendMessage('bot', 'Sorry, I did not understand that.');
    }
  } catch (err) {
    removeTypingIndicator();
    appendMessage('bot', 'Error contacting AI. Please try again.');
  }
});
