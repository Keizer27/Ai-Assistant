// assets/js/ai/api.js

import AI_CONFIG from "../../../ai-config.js";

export async function sendAIRequest(messages) {
  try {
    const response = await fetch(AI_CONFIG.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${AI_CONFIG.apiKey}`
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: messages,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("AI API Error:", error);
    return "Sorry, I couldn't process your request.";
  }
}
