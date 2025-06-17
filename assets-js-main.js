import { initAuth } from '../src/auth/auth-handler.js';
import { initResearchTool } from '../src/ui/tools/research-tool.js';
import { AI_CONFIG } from '../src/ai/config.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Firebase Auth
  initAuth();
  
  // Check if on dashboard
  if (window.location.pathname.includes('dashboard')) {
    // Load saved API key
    const apiKey = localStorage.getItem('keizer_ai_key') || AI_CONFIG.apiKey;
    
    // Initialize tools
    initResearchTool(apiKey);
    // initWritingTool(apiKey); etc.
    
    // Animate Keizer greeting
    document.getElementById('welcome-message').classList.add('animate__fadeIn');
  }
});
