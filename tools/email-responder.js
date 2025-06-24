import { addAIMessage, showToast, downloadAsFile, callGoogleAI } from '../scripts.js';

export function initializeEmailResponder(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="tool-header">
            <h2>Email Responder</h2>
        </div>
        <div class="tool-content">
            <div class="email-form">
                <div class="form-group">
                    <label>Received Email</label>
                    <textarea id="received-email" placeholder="Paste the email you received"></textarea>
                </div>
                <div class="form-group">
                    <label>Your Response Tone</label>
                    <select id="response-tone">
                        <option value="professional">Professional</option>
                        <option value="friendly">Friendly</option>
                        <option value="formal">Formal</option>
                        <option value="casual">Casual</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Key Points to Include</label>
                    <textarea id="response-points" placeholder="What you want to say in your response"></textarea>
                </div>
                <button class="generate-btn" id="generate-response">Generate Response</button>
            </div>
            <div class="chat-messages" id="email-responder-messages" style="display:none;"></div>
        </div>
        <div class="tool-actions" style="display:none;" id="email-actions">
            <button class="action-btn copy-btn" id="copy-email">
                <i class="fas fa-copy"></i> Copy
            </button>
            <button class="action-btn save-btn" id="save-email">
                <i class="fas fa-save"></i> Save
            </button>
        </div>
    `;
    
    const generateBtn = document.getElementById('generate-response');
    const messagesContainer = document.getElementById('email-responder-messages');
    const actionsContainer = document.getElementById('email-actions');
    
    generateBtn.addEventListener('click', generateResponse);
    
    async function generateResponse() {
        const receivedEmail = document.getElementById('received-email').value.trim();
        const tone = document.getElementById('response-tone').value;
        const points = document.getElementById('response-points').value.trim();
        
        if (!receivedEmail) {
            showToast('Please paste the received email');
            return;
        }
        
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        
        try {
            const prompt = `Write a ${tone} email response to this message: ${receivedEmail}. 
                           Key points to include: ${points || 'none specified'}. 
                           Format as a proper email with greeting and closing.`;
            
            const response = await callGoogleAI(prompt, "You are an expert at writing professional email responses.");
            
            document.querySelector('.email-form').style.display = 'none';
            messagesContainer.style.display = 'block';
            actionsContainer.style.display = 'flex';
            
            addAIMessage(response, 'email-responder-messages');
            
            document.getElementById('copy-email').addEventListener('click', () => {
                navigator.clipboard.writeText(response);
                showToast('Response copied to clipboard!');
            });
            
            document.getElementById('save-email').addEventListener('click', () => {
                downloadAsFile(response, 'email-response.txt');
            });
        } catch (error) {
            showToast('Failed to generate response');
        } finally {
            generateBtn.innerHTML = 'Generate Response';
        }
    }
}
