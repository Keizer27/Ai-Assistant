require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Key Configuration
const API_KEY = "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";

// Validate API Key
if (!API_KEY) {
  console.error('ERROR: No API_KEY configured');
  process.exit(1);
}

// AI Service Endpoints
const AI_SERVICES = {
  text: 'https://api.openai.com/v1/chat/completions',
  image: 'https://api.openai.com/v1/images/generations'
};

// Handle AI Requests
app.post('/api/ai', async (req, res) => {
  try {
    const { tool, prompt } = req.body;

    if (!tool || !prompt) {
      return res.status(400).json({ error: 'Tool and prompt are required' });
    }

    let response;
    switch (tool) {
      case 'image':
        response = await axios.post(AI_SERVICES.image, {
          prompt,
          n: 1,
          size: "512x512"
        }, {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        return res.json({ 
          type: 'image', 
          result: response.data.data[0].url 
        });

      default: // Text-based tools
        response = await axios.post(AI_SERVICES.text, {
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7
        }, {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        return res.json({ 
          type: 'text', 
          result: response.data.choices[0].message.content 
        });
    }
  } catch (error) {
    console.error('AI API Error:', error.response?.data || error.message);
    return res.status(500).json({ 
      error: 'AI service error',
      details: error.response?.data || error.message
    });
  }
});

// Serve Frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`AI API Key: ${API_KEY.substring(0, 5)}...${API_KEY.substring(API_KEY.length-5)}`);
});
