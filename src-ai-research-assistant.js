import { AIClient } from '../api.js';
import { formatCitations } from './citations.js';

export class ResearchAssistant {
  constructor(apiKey) {
    this.ai = new AIClient(apiKey);
  }

  async generateReport(url, style = "APA") {
    const prompt = this._buildPrompt(url, style);
    const response = await this.ai.sendRequest(prompt);
    return this._formatResponse(response, style);
  }

  _buildPrompt(url, style) {
    return `As Keizer AI Research Assistant, analyze: ${url}
      Generate:
      1. Summary (3 paragraphs)
      2. Key Findings (bullets)
      3. Critical Analysis
      4. 3 ${style} citations`;
  }

  _formatResponse(response, style) {
    return {
      content: response.choices[0].message.content,
      citations: formatCitations(response.choices[0].message.content, style),
      timestamp: new Date().toISOString()
    };
  }
}
