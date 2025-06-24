import { initializeAIChat } from './tools/ai-chat.js';
import { initializeArticleWriter } from './tools/article-writer.js';
import { initializeImageEditor } from './tools/image-editor.js';
import { initializeScriptWriter } from './tools/script-writer.js';
import { initializeResumeWriter } from './tools/resume-writer.js';
import { initializeContentCreation } from './tools/content-creation.js';
import { initializeMathSolver } from './tools/math-solver.js';
import { initializeEmailResponder } from './tools/email-responder.js';
import { initializeSocialMedia } from './tools/social-media.js';
import { initializeResearchWriter } from './tools/research-writer.js';
import { initializeReportGenerator } from './tools/report-generator.js';

// Google AI API Configuration
const GOOGLE_AI_API_KEY = 'AIzaSyCZ4Uj--CRx0HzktFJjn4DV-xXRPX28t-g';
const GOOGLE_AI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const toolsBtn = document.getElementById('toolsBtn');
    const closeTools = document.getElementById('closeTools');
    const toolsPanel = document.getElementById('toolsPanel');
    const mainContent = document.getElementById('mainContent');
    const defaultChat = document.getElementById('defaultChat');
    
    // Initialize default chat
    initializeAIChat('chatMessages', 'chatInput', 'sendBtn');
    
    // Show welcome message
    setTimeout(() => {
        addAIMessage(
            "I'm Keizer, your AI assistant. How may I help you today?",
            'chatMessages'
        );
    }, 500);

    // Toggle tools panel
    toolsBtn.addEventListener('click', () => {
        toolsPanel.classList.add('open');
    });

    closeTools.addEventListener('click', () => {
        toolsPanel.classList.remove('open');
    });

    // Tool items click handler
    document.querySelectorAll('.tool-item').forEach(item => {
        item.addEventListener('click', function() {
            const toolId = this.getAttribute('data-tool');
            loadTool(toolId);
            toolsPanel.classList.remove('open');
        });
    });

    function loadTool(toolId) {
        // Hide all tool pages and default chat
        document.querySelectorAll('.tool-page').forEach(page => {
            page.remove();
        });
        defaultChat.classList.remove('active');
        
        // Create and load the selected tool
        const toolPage = document.createElement('div');
        toolPage.className = 'tool-page active';
        toolPage.id = `${toolId}-page`;
        
        const toolHeader = document.createElement('div');
        toolHeader.className = 'tool-header';
        toolHeader.innerHTML = `
            <button class="back-btn" id="backBtn">
                <i class="fas fa-arrow-left"></i> Back
            </button>
            <h2>${toolId.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
                .join(' ')}</h2>
        `;
        
        const toolContent = document.createElement('div');
        toolContent.className = 'tool-content';
        toolContent.id = `${toolId}-content`;
        
        toolPage.appendChild(toolHeader);
        toolPage.appendChild(toolContent);
        mainContent.appendChild(toolPage);
        
        // Add back button functionality
        document.getElementById('backBtn').addEventListener('click', () => {
            toolPage.remove();
            defaultChat.classList.add('active');
        });
        
        // Initialize the specific tool
        switch(toolId) {
            case 'ai-chat':
                initializeAIChat(`${toolId}-content`);
                break;
            case 'article-writer':
                initializeArticleWriter(`${toolId}-content`);
                break;
            case 'image-editor':
                initializeImageEditor(`${toolId}-content`);
                break;
            case 'script-writer':
                initializeScriptWriter(`${toolId}-content`);
                break;
            case 'resume-writer':
                initializeResumeWriter(`${toolId}-content`);
                break;
            case 'content-creation':
                initializeContentCreation(`${toolId}-content`);
                break;
            case 'math-solver':
                initializeMathSolver(`${toolId}-content`);
                break;
            case 'email-responder':
                initializeEmailResponder(`${toolId}-content`);
                break;
            case 'social-media':
                initializeSocialMedia(`${toolId}-content`);
                break;
            case 'research-writer':
                initializeResearchWriter(`${toolId}-content`);
                break;
            case 'report-generator':
                initializeReportGenerator(`${toolId}-content`);
                break;
        }
    }
});

// Helper function to add AI messages
export function addAIMessage(message, containerId, withActions = true) {
    const container = document.getElementById(containerId);
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai-message';
    
    if (withActions) {
        messageDiv.innerHTML = `
            ${message}
            <div class="message-actions">
                <button class="message-action-btn copy-btn" title="Copy">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="message-action-btn save-btn" title="Save">
                    <i class="fas fa-save"></i>
                </button>
            </div>
        `;
        
        // Add event listeners for the action buttons
        messageDiv.querySelector('.copy-btn').addEventListener('click', () => {
            navigator.clipboard.writeText(message);
            showToast('Copied to clipboard!');
        });
        
        messageDiv.querySelector('.save-btn').addEventListener('click', () => {
            downloadAsFile(message, 'keizer-response.txt');
        });
    } else {
        messageDiv.textContent = message;
    }
    
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

// Helper function to show toast notifications
export function showToast(message) {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    }, 3000);
}

// Helper function to download content as a file
export function downloadAsFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('File saved!');
}

// Google AI API Call
export async function callGoogleAI(prompt, toolContext = '') {
    try {
        const response = await fetch(`${GOOGLE_AI_ENDPOINT}?key=${GOOGLE_AI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${toolContext} ${prompt}`
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error calling Google AI:', error);
        return "I'm sorry, I encountered an error. Please try again later.";
    }
}
