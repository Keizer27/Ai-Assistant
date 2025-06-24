const functions = require("firebase-functions");
const fetch = require("node-fetch"); // v2: npm install node-fetch

// Replace with your Google AI API endpoint and key securely
const GOOGLE_AI_API_URL = "https://YOUR_GOOGLE_AI_API_ENDPOINT";
const GOOGLE_AI_API_KEY = "YOUR_GOOGLE_AI_API_KEY";

exports.aiProxy = functions.https.onRequest(async (req, res) => {
  // CORS setup for Firebase hosting
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send('');
    return;
  }
  try {
    const { prompt, history } = req.body;
    // Call Google AI API securely from server-side
    const aiRes = await fetch(GOOGLE_AI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GOOGLE_AI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt,
        history
        // Add any other params your AI API requires
      })
    });
    const aiData = await aiRes.json();
    res.json({ text: aiData.text || aiData.choices?.[0]?.text || "No response." });
  } catch (err) {
    res.status(500).json({ error: "AI request failed." });
  }
});
