import { addAIMessage, showToast, downloadAsFile, callGoogleAI } from '../scripts.js';

export function initializeArticleWriter(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="tool-header">
            <h2>Article Writer</h2>
        </div>
        <div class="tool-content">
            <div class="chat-messages" id="article-writer-messages"></div>
            <div class="chat-input-container">
                <input type="text" class="chat-input" id="article-writer-input" placeholder="Enter article topic or instructions...">
                <button class="send-btn" id="article-writer-send">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
        <div class="tool-actions">
            <button class="action-btn copy-btn" id="copy-article">
                <i class="fas fa-copy"></i> Copy
            </button>
            <button class="action-btn save-btn" id="save-article">
                <i class="fas fa-save"></i> Save
            </button>
        </div>
    `;
    
    const messagesContainer = document.getElementById('article-writer-messages');
    const chatInput = document.getElementById('article-writer-input');
    const sendBtn = document.getElementById('article-writer-send');
    const copyBtn = document.getElementById('copy-article');
    const saveBtn = document.getElementById('save-article');
    
    let generatedArticle = '';
    
    // Show welcome message
    setTimeout(() => {
        addAIMessage(
            "I'm Keizer Article Writer. Tell me the topic or provide instructions for the article you want me to write.",
            'article-writer-messages',
            false
        );
    }, 500);
    
    sendBtn.addEventListener('click', () => generateArticle());
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') generateArticle();
    });
    
    copyBtn.addEventListener('click', () => {
        if (generatedArticle) {
            navigator.clipboard.writeText(generatedArticle);
            showToast('Article copied to clipboard!');
        }
    });
    
    saveBtn.addEventListener('click', () => {
        if (generatedArticle) {
            downloadAsFile(generatedArticle, 'keizer-article.txt');
        }
    });
    
    async function generateArticle() {
        const prompt = chatInput.value.trim();
        if (!prompt) return;
        
        // Add user message
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'message user-message';
        userMessageDiv.textContent = prompt;
        messagesContainer.appendChild(userMessageDiv);
        
        chatInput.value = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Show typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message';
        typingDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            // Call Google AI with article-specific context
            const context = "You are a professional article writer. Write a comprehensive, well-structured article about:";
            generatedArticle = await callGoogleAI(prompt, context);
            
            messagesContainer.removeChild(typingDiv);
            addAIMessage(generatedArticle, 'article-writer-messages');
        } catch (error) {
            messagesContainer.removeChild(typingDiv);
            addAIMessage("Failed to generate article. Please try again.", 'article-writer-messages');
        }
    }
}
