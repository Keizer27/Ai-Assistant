export class ResearchAssistant {
  constructor(aiClient) {
    this.ai = aiClient;
  }

  async generateReport(articleUrl, citationStyle = "APA") {
    const prompt = `As Keizer AI Research Assistant, analyze: ${articleUrl}
    
    Generate a comprehensive report with:
    1. Executive Summary (concise overview)
    2. Key Findings (bullet points)
    3. Critical Analysis (2 paragraphs)
    4. References (3 ${citationStyle} citations)
    
    Format with Markdown headers for each section.`;
    
    const response = await this.ai.sendRequest(prompt);
    return this.formatResponse(response, citationStyle);
  }

  formatResponse(response, style) {
    const content = response.choices[0]?.message?.content || "";
    return {
      content,
      html: this.markdownToHtml(content),
      citations: this.extractCitations(content, style)
    };
  }

  markdownToHtml(markdown) {
    return markdown
      .replace(/^# (.*)/gm, '<h2 class="text-xl font-bold mt-6 mb-2">$1</h2>')
      .replace(/^## (.*)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/- (.*)/g, '<li>$1</li>')
      .replace(/\n/g, '<br>');
  }

  extractCitations(text, style) {
    const citationRegex = new RegExp(`${style} Citation:?(.*?)(?=\\n\\w|$)`, 'gi');
    return [...text.matchAll(citationRegex)].map(match => match[1].trim());
  }
}
