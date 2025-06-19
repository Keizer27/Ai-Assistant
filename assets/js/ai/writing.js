// assets/js/ai/writing.js

import { sendAIRequest } from "./api.js";

export async function writeProjectOrJournal(topic, type = "project") {
  const writingPrompt = type === "project"
    ? `
You are an academic assistant. Write a complete student project on:
"${topic}"

The project should include:
1. Introduction
2. Objectives
3. Literature Review
4. Methodology
5. Results (assumed/hypothetical)
6. Discussion
7. Conclusion
8. References (APA format)

Keep it clear, formal, and structured like a university-level project.
`
    : `
You are an academic writing assistant. Write a journal article on:
"${topic}"

The article should include:
- Abstract
- Introduction
- Background
- Analysis
- Conclusion
- References (APA format)

Use professional tone and realistic references.
`;

  const messages = [
    {
      role: "system",
      content: "You are a professional academic content writer."
    },
    {
      role: "user",
      content: writingPrompt
    }
  ];

  const result = await sendAIRequest(messages);
  return result;
}
