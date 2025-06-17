import { AIClient } from './ai/api.js';
import { ResearchAssistant } from './ai/research.js';
import { WritingAssistant } from './ai/writing.js';

// Initialize AI
const aiClient = new AIClient();
const researchAssistant = new ResearchAssistant(aiClient);
const writingAssistant = new WritingAssistant(aiClient);

// UI Elements
const welcomePanel = document.getElementById('welcome-panel');
const toolContainers = {
  research: document.getElementById('research-tool'),
  writing: document.getElementById('writing-tool'),
  default: document.getElementById('default-dashboard')
};

// Animate Keizer welcome message
function animateKeizerGreeting() {
  welcomePanel.classList.add('animate__animated', 'animate__fadeInUp');
  setTimeout(() => {
    welcomePanel.classList.remove('animate__fadeInUp');
  }, 1000);
}

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
  animateKeizerGreeting();
  
  // Tool navigation
  document.querySelectorAll('[data-tool]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const tool = e.currentTarget.dataset.tool;
      showTool(tool);
    });
  });

  // Initialize research tool
  initResearchTool();
});

function showTool(tool) {
  // Hide all tools
  Object.values(toolContainers).forEach(container => {
    container.classList.add('hidden');
  });
  
  // Show selected tool
  if (toolContainers[tool]) {
    toolContainers[tool].classList.remove('hidden');
    document.getElementById('current-tool').textContent = 
      document.querySelector(`[data-tool="${tool}"] span`).textContent;
  } else {
    toolContainers.default.classList.remove('hidden');
    document.getElementById('current-tool').textContent = 'Dashboard';
  }
}

function initResearchTool() {
  const analyzeBtn = document.getElementById('analyze-btn');
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', async () => {
      try {
        const articleUrl = document.getElementById('article-url').value;
        const citationStyle = document.getElementById('citation-style').value;
        
        const response = await researchAssistant.generateReport(articleUrl, citationStyle);
        displayResults(response);
      } catch (error) {
        showError(error.message);
      }
    });
  }
}

function displayResults(data) {
  const resultsContainer = document.getElementById('results-container');
  resultsContainer.innerHTML = data.html;
  resultsContainer.classList.add('animate__animated', 'animate__fadeIn');
}

function showError(message) {
  const errorElement = document.getElementById('error-display');
  errorElement.textContent = message;
  errorElement.classList.remove('hidden');
  
  setTimeout(() => {
    errorElement.classList.add('hidden');
  }, 5000);
}

// Export for global access
window.logout = function() {
  firebase.auth().signOut();
};
