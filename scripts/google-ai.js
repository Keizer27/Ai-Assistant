const API_CONFIG = {
  endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  defaultParams: {
    temperature: 0.7,
    topP: 0.9,
    topK: 40
  }
};

let apiKey = '';

export function initializeGoogleAI(key) {
  if (!key) throw new Error('API key is required');
  apiKey = key;
}

export async function generateContent(prompt, context = '', options = {}) {
  try {
    const response = await fetch(`${API_CONFIG.endpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${context}\n\n${prompt}`
          }]
        }],
        generationConfig: {
          ...API_CONFIG.defaultParams,
          ...options
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_DANGEROUS',
            threshold: 'BLOCK_ONLY_HIGH'
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API request failed');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Tool-specific wrappers
export const chatAI = (prompt) => generateContent(
  prompt,
  "You are Keizer, a helpful AI assistant. Respond conversationally."
);

export const generateArticle = (topic, style) => generateContent(
  `Write a ${style} article about: ${topic}`,
  "You are a professional content writer. Create well-structured articles."
);

// Add other tool-specific wrappers...
