import { addAIMessage, showToast, downloadAsFile, callGoogleAI } from '../scripts.js';

export function initializeResumeWriter(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="tool-header">
            <h2>Resume Writer</h2>
        </div>
        <div class="tool-content">
            <div class="resume-form">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" id="resume-name" placeholder="Your full name">
                </div>
                <div class="form-group">
                    <label>Professional Title</label>
                    <input type="text" id="resume-title" placeholder="e.g. Software Engineer">
                </div>
                <div class="form-group">
                    <label>Experience (years)</label>
                    <input type="number" id="resume-exp" placeholder="Years of experience">
                </div>
                <div class="form-group">
                    <label>Key Skills (comma separated)</label>
                    <textarea id="resume-skills" placeholder="JavaScript, Python, Project Management"></textarea>
                </div>
                <div class="form-group">
                    <label>Education</label>
                    <textarea id="resume-education" placeholder="Your educational background"></textarea>
                </div>
                <button class="generate-btn" id="generate-resume">Generate Resume</button>
            </div>
            <div class="chat-messages" id="resume-writer-messages" style="display:none;"></div>
        </div>
        <div class="tool-actions" style="display:none;" id="resume-actions">
            <button class="action-btn copy-btn" id="copy-resume">
                <i class="fas fa-copy"></i> Copy
            </button>
            <button class="action-btn save-btn" id="save-resume">
                <i class="fas fa-save"></i> Save as DOCX
            </button>
        </div>
    `;
    
    const generateBtn = document.getElementById('generate-resume');
    const messagesContainer = document.getElementById('resume-writer-messages');
    const actionsContainer = document.getElementById('resume-actions');
    
    generateBtn.addEventListener('click', generateResume);
    
    async function generateResume() {
        const name = document.getElementById('resume-name').value.trim();
        const title = document.getElementById('resume-title').value.trim();
        const experience = document.getElementById('resume-exp').value.trim();
        const skills = document.getElementById('resume-skills').value.trim();
        const education = document.getElementById('resume-education').value.trim();
        
        if (!name || !title || !experience || !skills) {
            showToast('Please fill all required fields');
            return;
        }
        
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        
        try {
            const prompt = `Create a professional resume for ${name}, a ${title} with ${experience} years of experience. 
                           Skills: ${skills}. Education: ${education || 'Not specified'}. 
                           Format with clear sections and bullet points.`;
            
            const resumeContent = await callGoogleAI(prompt, "You are a professional resume writer.");
            
            document.querySelector('.resume-form').style.display = 'none';
            messagesContainer.style.display = 'block';
            actionsContainer.style.display = 'flex';
            
            addAIMessage(resumeContent, 'resume-writer-messages');
            
            document.getElementById('copy-resume').addEventListener('click', () => {
                navigator.clipboard.writeText(resumeContent);
                showToast('Resume copied to clipboard!');
            });
            
            document.getElementById('save-resume').addEventListener('click', () => {
                downloadAsFile(resumeContent, `${name}-resume.docx`);
            });
        } catch (error) {
            showToast('Failed to generate resume');
        } finally {
            generateBtn.innerHTML = 'Generate Resume';
        }
    }
}
