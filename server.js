const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Your API key embedded directly in the code
const API_KEY = "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";

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// API endpoint
app.post('/api/chat', (req, res) => {
    const { tool, message } = req.body;
    
    console.log(`Received request for ${tool} with message: ${message}`);
    console.log(`Using API key: ${API_KEY.substring(0, 5)}...${API_KEY.substring(API_KEY.length-5)}`);

    // Simulate different responses based on tool
    const responses = {
        research: `Based on my research about "${message}", here's what I found...`,
        writer: `Here's a well-written article about "${message}":\n\nLorem ipsum...`,
        image: `I would generate an image of "${message}" using my API key if this were connected to a real service.`
    };

    res.json({
        text: responses[tool] || `I'm not sure how to help with ${tool} yet.`
    });
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'chat.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API Key: ${API_KEY.substring(0, 5)}...${API_KEY.substring(API_KEY.length-5)}`);
});
