import { addAIMessage, showToast, downloadAsFile, callGoogleAI } from '../scripts.js';

export function initializeReportGenerator(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="tool-header">
            <h2>Report Generator</h2>
        </div>
        <div class="tool-content">
            <div class="report-form">
                <div class="form-group">
                    <label>Report Title</label>
                    <input type="text" id="report-title" placeholder="Report title">
                </div>
                <div class="form-group">
                    <label>Report Type</label>
                    <select id="report-type">
                        <option value="business">Business</option>
                        <option value="academic">Academic</option>
                        <option value="technical">Technical</option>
                        <option value="financial">Financial</option>
                        <option value="progress">Progress</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Key Findings/Data</label>
                    <textarea id="report-data" placeholder="Enter your data or key findings"></textarea>
                </div>
                <div class="form-group">
                    <label>Length</label>
                    <select id="report-length">
                        <option value="short">Short (1-2 pages)</option>
                        <option value="medium">Medium (3-5 pages)</option>
                        <option value="long">Long (6+ pages)</option>
                    </select>
                </div>
                <button class="generate-btn" id="generate-report">Generate Report</button>
            </div>
            <div class="chat-messages" id="report-generator-messages" style="display:none;"></div>
        </div>
        <div class="tool-actions" style="display:none;" id="report-actions">
            <button class="action-btn copy-btn" id="copy-report">
                <i class="fas fa-copy"></i> Copy
            </button>
            <button class="action-btn save-btn" id="save-report">
                <i class="fas fa-save"></i> Save as DOCX
            </button>
        </div>
    `;
    
    const generateBtn = document.getElementById('generate-report');
    const messagesContainer = document.getElementById('report-generator-messages');
    const actionsContainer = document.getElementById('report-actions');
    
    generateBtn.addEventListener('click', generateReport);
    
    async function generateReport() {
        const title = document.getElementById('report-title').value.trim();
        const type = document.getElementById('report-type').value;
        const data = document.getElementById('report-data').value.trim();
        const length = document.getElementById('report-length').value;
        
        if (!title || !data) {
            showToast('Please enter title and key findings');
            return;
        }
        
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        
        try {
            const prompt = `Generate a ${length} ${type} report titled "${title}". 
                           Key findings/data: ${data}. 
                           Include an executive summary, methodology, findings, and conclusions. 
                           Use proper headings and formatting.`;
            
            const report = await callGoogleAI(prompt, "You are a professional report writer.");
            
            document.querySelector('.report-form').style.display = 'none';
            messagesContainer.style.display = 'block';
            actionsContainer.style.display = 'flex';
            
            addAIMessage(report, 'report-generator-messages');
            
            document.getElementById('copy-report').addEventListener('click', () => {
                navigator.clipboard.writeText(report);
                showToast('Report copied to clipboard!');
            });
            
            document.getElementById('save-report').addEventListener('click', () => {
                downloadAsFile(report, `${title}-report.docx`);
            });
        } catch (error) {
            showToast('Failed to generate report');
        } finally {
            generateBtn.innerHTML = 'Generate Report';
        }
    }
}
