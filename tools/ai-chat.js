import { addAIMessage, callGoogleAI } from '../scripts.js';

export function initializeAIChat(containerId, inputId, buttonId) {
    const container = document.getElementById(containerId);
    const chatInput = inputId ? document.getElementById(inputId) : null;
    const sendBtn = buttonId ? document.getElementById(buttonId) : null;
    
    if (!container) return;
    
    // Create chat interface if it doesn't exist
    if (!container.classList.contains('chat-container')) {
        container.innerHTML = `
            <div class="chat-messages" id="${containerId}-messages"></div>
            <div class="chat-input-container">
                <input type="text" class="chat-input" id="${containerId}-input" placeholder="Ask me anything...">
                <button class="send-btn" id="${containerId}-send">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        `;
        
        // Initialize the new chat interface
        const messagesContainer = document.getElementById(`${containerId}-messages`);
        const newChatInput = document.getElementById(`${containerId}-input`);
        const newSendBtn = document.getElementById(`${containerId}-send`);
        
        newSendBtn.addEventListener('click', () => sendMessage(newChatInput, messagesContainer));
        newChatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage(newChatInput, messagesContainer);
        });
        
        // Show welcome message
        setTimeout(() => {
            addAIMessage(
                "I'm Keizer, your AI assistant. How may I help you today?",
                `${containerId}-messages`
            );
        }, 500);
    }
    
    // If using existing chat elements
    if (chatInput && sendBtn) {
        sendBtn.addEventListener('click', () => sendMessage(chatInput, container));
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage(chatInput, container);
        });
    }
    
    async function sendMessage(inputElement, messagesContainer) {
        const message = inputElement.value.trim();
        if (message) {
            // Add user message
            const userMessageDiv = document.createElement('div');
            userMessageDiv.className = 'message user-message';
            userMessageDiv.textContent = message;
            messagesContainer.appendChild(userMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            inputElement.value = '';
            
            // Show typing indicator
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message ai-message';
            typingDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
            messagesContainer.appendChild(typingDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            try {
                const aiResponse = await callGoogleAI(message);
                messagesContainer.removeChild(typingDiv);
                addAIMessage(aiResponse, messagesContainer.id);
            } catch (error) {
                messagesContainer.removeChild(typingDiv);
                addAIMessage("Sorry, I'm having trouble connecting to the AI service.", messagesContainer.id);
            }
        }
    }
}
