import { ResearchAssistant } from '../../ai/research/assistant.js';

export function initResearchTool(apiKey) {
  const assistant = new ResearchAssistant(apiKey);
  const form = document.getElementById('research-form');
  const results = document.getElementById('research-results');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = new FormData(form);
    const response = await assistant.generateReport(
      data.get('url'),
      data.get('style')
    );

    results.innerHTML = `
      <div class="report-section">
        <h3>Research Report</h3>
        <div class="content">${response.content}</div>
        <div class="citations">
          <h4>Citations</h4>
          <ul>
            ${response.citations.map(c => `<li>${c}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  });
}
