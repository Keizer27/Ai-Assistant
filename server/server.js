require('dotenv').config();
const express = require('express');
const path = require('path');
const keyManager = require('./key-manager');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.post('/api/research', async (req, res) => {
  try {
    // Simulate research (replace with actual OpenRouter call)
    const mockResults = [
      {
        title: `Recent Advances in ${req.body.topic}`,
        citation: formatCitation({
          author: "Smith, J. et al.",
          title: `Recent Advances in ${req.body.topic}`,
          journal: "Journal of Science",
          year: "2023"
        }, req.body.style),
        abstract: `This paper explores current developments in ${req.body.topic} with focus on practical applications.`,
        source: "Journal of Science • 2023"
      }
    ];
    
    res.json(mockResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function formatCitation(data, style) {
  // Citation formatting logic
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
