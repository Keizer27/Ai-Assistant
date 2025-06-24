// --- Firebase Initialization ---
const firebaseConfig = {
  // TODO: Paste your firebaseConfig here
};

firebase.initializeApp(firebaseConfig);
// If you use Firestore/Auth, you can initialize here as needed

// --- Modal & Dashboard Logic ---
const overlay = document.getElementById('modal-overlay');
const chatModal = document.getElementById('chat-modal');
const chatCloseBtn = document.getElementById('close-chat');
const toolCards = document.querySelectorAll('.tool-card');

// Show modal utility
function showModal(modal) {
  overlay.classList.remove('hidden');
  modal.classList.remove('hidden');
}

// Hide all modals utility
function hideModals() {
  overlay.classList.add('hidden');
  document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
}

// Tool card click handlers
toolCards.forEach(card => {
  card.addEventListener('click', () => {
    const tool = card.dataset.tool;
    if (tool === 'chat') {
      showModal(chatModal);
      startChatWelcome();
    } else {
      alert('This tool is not implemented in this demo yet, but you can scaffold its modal in the HTML and wire it up in app.js!');
    }
  });
});

overlay.addEventListener('click', hideModals);
chatCloseBtn.addEventListener('click', hideModals);

// --- Chat AI Logic ---
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');

function appendMessage(role, text) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-message ${role}`;
  const span = document.createElement('span');
  span.textContent = text;
  msgDiv.appendChild(span);
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'chat-message bot';
  const typingSpan = document.createElement('span');
  typingSpan.innerHTML = `<span class="typing-indicator">
    <span>.</span><span>.</span><span>.</span>
  </span>`;
  typingDiv.appendChild(typingSpan);
  typingDiv.classList.add('typing');
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
    appendMessage('bot', "I'm Keizer, your AI-assistant.");
  }, 390);
}

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
    // You must deploy the cloud function below to your Firebase project
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
