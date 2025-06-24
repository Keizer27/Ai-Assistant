import { initializeGoogleAI } from './google-ai.js';
import { initializeChat } from './tools/chat.js';
import { initializeArticleWriter } from './tools/article.js';
import { initializeImageEditor } from './tools/image.js';
// Import other tools...

// App State Management
const state = {
  activeTool: 'chat',
  apiKey: 'AIzaSyCZ4Uj--CRx0HzktFJjn4DV-xXRPX28t-g',
  conversationHistory: []
};

// DOM Elements
const elements = {
  app: document.getElementById('app'),
  toolsPanel: document.getElementById('toolsPanel'),
  chatView: document.getElementById('chatView'),
  // Add other elements...
};

// Initialize App
async function initApp() {
  try {
    // Initialize Google AI
    await initializeGoogleAI(state.apiKey);
    
    // Initialize default chat
    initializeChat();
    
    // Setup event listeners
    setupEventListeners();
    
    // Show welcome message
    showWelcomeMessage();
    
    console.log('Keizer AI initialized successfully');
  } catch (error) {
    console.error('Initialization failed:', error);
    showToast('Failed to initialize app', 'error');
  }
}

// Event Listeners
function setupEventListeners() {
  // Tools panel toggle
  document.getElementById('toolsToggle').addEventListener('click', toggleToolsPanel);
  document.getElementById('closeTools').addEventListener('click', toggleToolsPanel);
  
  // Tool selection
  document.querySelectorAll('.tool-item').forEach(item => {
    item.addEventListener('click', () => {
      const tool = item.dataset.tool;
      loadTool(tool);
      toggleToolsPanel();
    });
  });
  
  // Window events
  window.addEventListener('resize', handleResize);
}

// Tool Loading System
async function loadTool(toolId) {
  try {
    // Show loading state
    showLoadingState(toolId);
    
    // Unload current tool
    unloadCurrentTool();
    
    // Load new tool
    switch(toolId) {
      case 'chat':
        await initializeChat();
        break;
      case 'article':
        await initializeArticleWriter();
        break;
      case 'image':
        await initializeImageEditor();
        break;
      // Add other tools...
      default:
        throw new Error(`Unknown tool: ${toolId}`);
    }
    
    // Update state
    state.activeTool = toolId;
    
  } catch (error) {
    console.error(`Failed to load ${toolId}:`, error);
    showToast(`Failed to load ${toolId.replace('-', ' ')}`, 'error');
    // Fallback to chat
    loadTool('chat');
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initApp);
