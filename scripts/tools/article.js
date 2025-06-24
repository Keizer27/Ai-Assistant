import { generateArticle } from '../google-ai.js';
import { showToast, downloadFile } from '../utils.js';

export async function initializeArticleWriter() {
  // Create UI
  const container = document.createElement('div');
  container.className = 'article-writer';
  container.innerHTML = `
    <div class="tool-header">
      <h2><i class="fas fa-newspaper"></i> Article Writer</h2>
      <button class="back-button"><i class="fas fa-arrow-left"></i> Back</button>
    </div>
    <div class="article-form">
      <div class="form-group">
        <label>Article Topic</label>
        <input type="text" id="articleTopic" placeholder="Enter topic..." required>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Tone</label>
          <select id="articleTone">
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="academic">Academic</option>
          </select>
        </div>
        <div class="form-group">
          <label>Length</label>
          <select id="articleLength">
            <option value="short">Short (300 words)</option>
            <option value="medium">Medium (600 words)</option>
            <option value="long">Long (1000+ words)</option>
          </select>
        </div>
      </div>
      <button id="generateArticle" class="generate-button">
        <i class="fas fa-magic"></i> Generate Article
      </button>
    </div>
    <div class="article-results" style="display:none;">
      <div class="article-content"></div>
      <div class="article-actions">
        <button id="copyArticle" class="action-button">
          <i class="fas fa-copy"></i> Copy
        </button>
        <button id="downloadArticle" class="action-button">
          <i class="fas fa-download"></i> Download
        </button>
      </div>
    </div>
  `;

  // Add to DOM
  document.querySelector('.app-main').appendChild(container);

  // Event Listeners
  document.getElementById('generateArticle').addEventListener('click', generateArticleHandler);
  container.querySelector('.back-button').addEventListener('click', () => loadTool('chat'));

  async function generateArticleHandler() {
    const topic = document.getElementById('articleTopic').value.trim();
    const tone = document.getElementById('articleTone').value;
    const length = document.getElementById('articleLength').value;

    if (!topic) {
      showToast('Please enter a topic', 'warning');
      return;
    }

    try {
      // Show loading state
      const button = document.getElementById('generateArticle');
      button.disabled = true;
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

      // Generate article
      const article = await generateArticle(
        topic, 
        `${tone} style, ${length} length`
      );

      // Display results
      showArticleResults(article);
    } catch (error) {
      showToast('Failed to generate article: ' + error.message, 'error');
    } finally {
      const button = document.getElementById('generateArticle');
      button.disabled = false;
      button.innerHTML = '<i class="fas fa-magic"></i> Generate Article';
    }
  }

  function showArticleResults(content) {
    const form = container.querySelector('.article-form');
    const results = container.querySelector('.article-results');
    const contentDiv = container.querySelector('.article-content');

    // Format content with paragraphs
    contentDiv.innerHTML = content.split('\n\n')
      .map(para => `<p>${para}</p>`)
      .join('');

    // Set up action buttons
    document.getElementById('copyArticle').addEventListener('click', () => {
      navigator.clipboard.writeText(content);
      showToast('Article copied!', 'success');
    });

    document.getElementById('downloadArticle').addEventListener('click', () => {
      const topic = document.getElementById('articleTopic').value.trim() || 'article';
      downloadFile(content, `${topic}.txt`);
    });

    // Show results
    form.style.display = 'none';
    results.style.display = 'block';
  }
}
