import { addAIMessage, showToast, downloadAsFile, callGoogleAI } from '../scripts.js';

export function initializeContentCreation(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="tool-header">
            <h2>Content Creation</h2>
        </div>
        <div class="tool-content">
            <div class="content-form">
                <div class="form-group">
                    <label>Content Type</label>
                    <select id="content-type">
                        <option value="blog">Blog Post</option>
                        <option value="social">Social Media Post</option>
                        <option value="newsletter">Newsletter</option>
                        <option value="product">Product Description</option>
                        <option value="ad">Ad Copy</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Topic/Title</label>
                    <input type="text" id="content-topic" placeholder="Content topic or title">
                </div>
                <div class="form-group">
                    <label>Target Audience</label>
                    <input type="text" id="content-audience" placeholder="e.g. Young professionals, Parents">
                </div>
                <div class="form-group">
                    <label>Key Points</label>
                    <textarea id="content-points" placeholder="Main points to include"></textarea>
                </div>
                <div class="form-group">
                    <label>Tone</label>
                    <select id="content-tone">
                        <option value="professional">Professional</option>
                        <option value="casual">Casual</option>
                        <option value="friendly">Friendly</option>
                        <option value="authoritative">Authoritative</option>
                        <option value="humorous">Humorous</option>
                    </select>
                </div>
                <button class="generate-btn" id="generate-content">Generate Content</button>
            </div>
            <div class="chat-messages" id="content-creation-messages" style="display:none;"></div>
        </div>
        <div class="tool-actions" style="display:none;" id="content-actions">
            <button class="action-btn copy-btn" id="copy-content">
                <i class="fas fa-copy"></i> Copy
            </button>
            <button class="action-btn save-btn" id="save-content">
                <i class="fas fa-save"></i> Save
            </button>
        </div>
    `;
    
    const generateBtn = document.getElementById('generate-content');
    const messagesContainer = document.getElementById('content-creation-messages');
    const actionsContainer = document.getElementById('content-actions');
    
    generateBtn.addEventListener('click', generateContent);
    
    async function generateContent() {
        const type = document.getElementById('content-type').value;
        const topic = document.getElementById('content-topic').value.trim();
        const audience = document.getElementById('content-audience').value.trim();
        const points = document.getElementById('content-points').value.trim();
        const tone = document.getElementById('content-tone').value;
        
        if (!topic) {
            showToast('Please enter a topic/title');
            return;
        }
        
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        
        try {
            const prompt = `Create ${type} content about "${topic}" for ${audience || 'a general audience'}. 
                           Key points to include: ${points || 'none specified'}. 
                           Use a ${tone} tone. Make it engaging and well-structured.`;
            
            const content = await callGoogleAI(prompt, "You are a professional content creator.");
            
            document.querySelector('.content-form').style.display = 'none';
            messagesContainer.style.display = 'block';
            actionsContainer.style.display = 'flex';
            
            addAIMessage(content, 'content-creation-messages');
            
            document.getElementById('copy-content').addEventListener('click', () => {
                navigator.clipboard.writeText(content);
                showToast('Content copied to clipboard!');
            });
            
            document.getElementById('save-content').addEventListener('click', () => {
                downloadAsFile(content, `${type}-content-${topic.substring(0, 20)}.txt`);
            });
        } catch (error) {
            showToast('Failed to generate content');
        } finally {
            generateBtn.innerHTML = 'Generate Content';
        }
    }
}
