import { addAIMessage, showToast, downloadAsFile, callGoogleAI } from '../scripts.js';

export function initializeResearchWriter(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="tool-header">
            <h2>Research/Project Writer</h2>
        </div>
        <div class="tool-content">
            <div class="research-form">
                <div class="form-group">
                    <label>Research Topic</label>
                    <textarea id="research-topic" rows="3" placeholder="Enter your research topic or question"></textarea>
                </div>
                <div class="form-group">
                    <label>Key Points (optional)</label>
                    <textarea id="research-points" rows="3" placeholder="Enter any specific points to include"></textarea>
                </div>
                <div class="reference-format">
                    <label>Reference Format:</label>
                    <select id="reference-format">
                        <option value="apa">APA</option>
                        <option value="mla">MLA</option>
                        <option value="chicago">Chicago</option>
                        <option value="ieee">IEEE</option>
                        <option value="harvard">Harvard</option>
                        <option value="vancouver">Vancouver</option>
                    </select>
                    <button class="generate-btn" id="generate-research">Generate Research</button>
                </div>
            </div>
            <div class="chat-messages" id="research-writer-messages" style="display:none;"></div>
        </div>
        <div class="tool-actions" style="display:none;" id="research-actions">
            <button class="action-btn copy-btn" id="copy-research">
                <i class="fas fa-copy"></i> Copy
            </button>
            <button class="action-btn save-btn" id="save-research">
                <i class="fas fa-save"></i> Save as DOCX
            </button>
        </div>
    `;
    
    const generateBtn = document.getElementById('generate-research');
    const messagesContainer = document.getElementById('research-writer-messages');
    const actionsContainer = document.getElementById('research-actions');
    
    generateBtn.addEventListener('click', generateResearch);
    
    async function generateResearch() {
        const topic = document.getElementById('research-topic').value.trim();
        const points = document.getElementById('research-points').value.trim();
        const format = document.getElementById('reference-format').value;
        
        if (!topic) {
            showToast('Please enter a research topic');
            return;
        }
        
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        
        try {
            const prompt = `Write a research paper about: ${topic}. ${points ? `Include these points: ${points}` : ''}. 
                           Use ${format.toUpperCase()} citation format. Include references section.`;
            
            const researchContent = await callGoogleAI(prompt, "You are an academic research assistant.");
            
            document.querySelector('.research-form').style.display = 'none';
            messagesContainer.style.display = 'block';
            actionsContainer.style.display = 'flex';
            
            addAIMessage(researchContent, 'research-writer-messages');
            
            document.getElementById('copy-research').addEventListener('click', () => {
                navigator.clipboard.writeText(researchContent);
                showToast('Research copied to clipboard!');
            });
            
            document.getElementById('save-research').addEventListener('click', () => {
                downloadAsFile(researchContent, `research-paper-${format}.docx`);
            });
        } catch (error) {
            showToast('Failed to generate research');
        } finally {
            generateBtn.innerHTML = 'Generate Research';
        }
    }
}
