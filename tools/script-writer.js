import { addAIMessage, showToast, downloadAsFile, callGoogleAI } from '../scripts.js';

export function initializeScriptWriter(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="tool-header">
            <h2>Script Writer</h2>
        </div>
        <div class="tool-content">
            <div class="script-form">
                <div class="form-group">
                    <label>Script Type</label>
                    <select id="script-type">
                        <option value="movie">Movie</option>
                        <option value="tv">TV Show</option>
                        <option value="play">Play</option>
                        <option value="video">Video</option>
                        <option value="podcast">Podcast</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" id="script-title" placeholder="Script title">
                </div>
                <div class="form-group">
                    <label>Genre</label>
                    <input type="text" id="script-genre" placeholder="e.g. Comedy, Drama">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="script-desc" placeholder="Brief description of the script"></textarea>
                </div>
                <button class="generate-btn" id="generate-script">Generate Script</button>
            </div>
            <div class="chat-messages" id="script-writer-messages" style="display:none;"></div>
        </div>
        <div class="tool-actions" style="display:none;" id="script-actions">
            <button class="action-btn copy-btn" id="copy-script">
                <i class="fas fa-copy"></i> Copy
            </button>
            <button class="action-btn save-btn" id="save-script">
                <i class="fas fa-save"></i> Save as PDF
            </button>
        </div>
    `;
    
    const generateBtn = document.getElementById('generate-script');
    const messagesContainer = document.getElementById('script-writer-messages');
    const actionsContainer = document.getElementById('script-actions');
    
    generateBtn.addEventListener('click', generateScript);
    
    async function generateScript() {
        const type = document.getElementById('script-type').value;
        const title = document.getElementById('script-title').value.trim();
        const genre = document.getElementById('script-genre').value.trim();
        const desc = document.getElementById('script-desc').value.trim();
        
        if (!title || !desc) {
            showToast('Please enter title and description');
            return;
        }
        
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        
        try {
            const prompt = `Write a ${type} script titled "${title}" in the ${genre} genre. Description: ${desc}. 
                           Include proper script formatting with scene headings, action lines, and dialogue.`;
            
            const scriptContent = await callGoogleAI(prompt, "You are a professional script writer.");
            
            document.querySelector('.script-form').style.display = 'none';
            messagesContainer.style.display = 'block';
            actionsContainer.style.display = 'flex';
            
            addAIMessage(scriptContent, 'script-writer-messages');
            
            document.getElementById('copy-script').addEventListener('click', () => {
                navigator.clipboard.writeText(scriptContent);
                showToast('Script copied to clipboard!');
            });
            
            document.getElementById('save-script').addEventListener('click', () => {
                downloadAsFile(scriptContent, `${title}-script.pdf`);
            });
        } catch (error) {
            showToast('Failed to generate script');
        } finally {
            generateBtn.innerHTML = 'Generate Script';
        }
    }
}
