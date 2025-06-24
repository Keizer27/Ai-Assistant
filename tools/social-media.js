import { addAIMessage, showToast, downloadAsFile, callGoogleAI } from '../scripts.js';

export function initializeSocialMedia(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="tool-header">
            <h2>Social Media Post</h2>
        </div>
        <div class="tool-content">
            <div class="social-form">
                <div class="form-group">
                    <label>Platform</label>
                    <select id="social-platform">
                        <option value="twitter">Twitter/X</option>
                        <option value="facebook">Facebook</option>
                        <option value="instagram">Instagram</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="tiktok">TikTok</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Post Topic</label>
                    <input type="text" id="post-topic" placeholder="What's your post about?">
                </div>
                <div class="form-group">
                    <label>Key Message</label>
                    <textarea id="post-message" placeholder="Main points to include"></textarea>
                </div>
                <div class="form-group">
                    <label>Hashtags (optional)</label>
                    <input type="text" id="post-hashtags" placeholder="#example #hashtags">
                </div>
                <div class="form-group">
                    <label>Tone</label>
                    <select id="post-tone">
                        <option value="professional">Professional</option>
                        <option value="casual">Casual</option>
                        <option value="funny">Funny</option>
                        <option value="inspirational">Inspirational</option>
                    </select>
                </div>
                <button class="generate-btn" id="generate-post">Generate Post</button>
            </div>
            <div class="chat-messages" id="social-media-messages" style="display:none;"></div>
        </div>
        <div class="tool-actions" style="display:none;" id="social-actions">
            <button class="action-btn copy-btn" id="copy-social">
                <i class="fas fa-copy"></i> Copy
            </button>
            <button class="action-btn save-btn" id="save-social">
                <i class="fas fa-save"></i> Save
            </button>
        </div>
    `;
    
    const generateBtn = document.getElementById('generate-post');
    const messagesContainer = document.getElementById('social-media-messages');
    const actionsContainer = document.getElementById('social-actions');
    
    generateBtn.addEventListener('click', generatePost);
    
    async function generatePost() {
        const platform = document.getElementById('social-platform').value;
        const topic = document.getElementById('post-topic').value.trim();
        const message = document.getElementById('post-message').value.trim();
        const hashtags = document.getElementById('post-hashtags').value.trim();
        const tone = document.getElementById('post-tone').value;
        
        if (!topic) {
            showToast('Please enter a post topic');
            return;
        }
        
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        
        try {
            const prompt = `Create a ${tone} ${platform} post about "${topic}". 
                           Key message: ${message || 'none specified'}. 
                           ${hashtags ? `Include these hashtags: ${hashtags}` : 'Add relevant hashtags'}. 
                           Format appropriately for ${platform}.`;
            
            const post = await callGoogleAI(prompt, "You are a social media content creator.");
            
            document.querySelector('.social-form').style.display = 'none';
            messagesContainer.style.display = 'block';
            actionsContainer.style.display = 'flex';
            
            addAIMessage(post, 'social-media-messages');
            
            document.getElementById('copy-social').addEventListener('click', () => {
                navigator.clipboard.writeText(post);
                showToast('Post copied to clipboard!');
            });
            
            document.getElementById('save-social').addEventListener('click', () => {
                downloadAsFile(post, `${platform}-post.txt`);
            });
        } catch (error) {
            showToast('Failed to generate post');
        } finally {
            generateBtn.innerHTML = 'Generate Post';
        }
    }
}
