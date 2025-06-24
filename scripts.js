// Configuration Object
const CONFIG = {
  GOOGLE_AI: {
    API_KEY: 'AIzaSyCZ4Uj--CRx0HzktFJjn4DV-xXRPX28t-g',
    ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    SAFETY_SETTINGS: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH'
      }
    ],
    GENERATION_CONFIG: {
      temperature: 0.9,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048
    }
  },
  UI: {
    MAX_TOASTS: 3,
    TYPING_INDICATOR_DELAY: 1500,
    API_TIMEOUT: 10000
  }
};

// State Management
const appState = {
  activeTool: null,
  pendingRequests: new Map(),
  toastQueue: [],
  userPreferences: {
    darkMode: true,
    autoSave: false
  }
};

// Enhanced API Call with Retry Logic
async function callGoogleAI(prompt, context = '', retries = 2) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CONFIG.UI.API_TIMEOUT);

  try {
    const response = await fetch(`${CONFIG.GOOGLE_AI.ENDPOINT}?key=${CONFIG.GOOGLE_AI.API_KEY}`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Version': 'KeizerAI/1.0.0'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `${context}\n\n${prompt}` }]
        }],
        safetySettings: CONFIG.GOOGLE_AI.SAFETY_SETTINGS,
        generationConfig: CONFIG.GOOGLE_AI.GENERATION_CONFIG
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please try again.');
    }
    
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000 * (3 - retries)));
      return callGoogleAI(prompt, context, retries - 1);
    }
    
    throw error;
  }
}

// Tool Initialization with Validation
function initializeTool(toolId, containerId) {
  try {
    // Validate container exists
    const container = document.getElementById(containerId);
    if (!container) throw new Error(`Container ${containerId} not found`);
    
    // Prevent duplicate initialization
    if (container.dataset.initialized === 'true') return;
    container.dataset.initialized = 'true';

    // Tool-specific initialization
    switch(toolId) {
      case 'ai-chat':
        initAIChat(container);
        break;
      case 'image-editor':
        initImageEditor(container);
        break;
      // ... other tools
      default:
        throw new Error(`Unknown tool: ${toolId}`);
    }

    // Analytics event
    logToolEvent(toolId, 'init');
  } catch (error) {
    console.error(`Tool ${toolId} initialization failed:`, error);
    showToast(`Failed to load ${toolId.replace('-', ' ')} tool`, 'error');
  }
}

// Example Tool: Enhanced AI Chat
function initAIChat(container) {
  // DOM Elements
  const messagesContainer = document.createElement('div');
  messagesContainer.className = 'chat-messages';
  messagesContainer.id = 'ai-chat-messages';
  
  const inputContainer = document.createElement('div');
  inputContainer.className = 'chat-input-container';
  
  const inputField = document.createElement('input');
  inputField.type = 'text';
  inputField.className = 'chat-input';
  inputField.placeholder = 'Ask me anything...';
  
  const sendButton = document.createElement('button');
  sendButton.className = 'send-btn';
  sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
  
  // Assemble UI
  inputContainer.append(inputField, sendButton);
  container.append(messagesContainer, inputContainer);
  
  // Event Listeners with Debouncing
  let isProcessing = false;
  
  const sendMessage = async () => {
    if (isProcessing) return;
    
    const message = inputField.value.trim();
    if (!message) return;
    
    isProcessing = true;
    inputField.disabled = true;
    sendButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    try {
      // Add user message
      addMessage(message, 'user');
      
      // Show typing indicator
      const typingId = showTypingIndicator();
      
      // Get AI response
      const response = await callGoogleAI(
        message, 
        "You are Keizer, a helpful AI assistant. Respond conversationally."
      );
      
      // Update UI
      removeTypingIndicator(typingId);
      addMessage(response, 'ai');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      isProcessing = false;
      inputField.disabled = false;
      sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
      inputField.focus();
    }
  };
  
  sendButton.addEventListener('click', sendMessage);
  inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
  
  // Welcome message
  setTimeout(() => {
    addMessage(
      "I'm Keizer, your AI assistant. How can I help you today?", 
      'ai',
      false
    );
  }, 500);
}
