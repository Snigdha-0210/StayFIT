const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { mood, sleep, energy, stress, workout, burnoutScore, recoveryScore, userPrompt } = req.body;

  const groqKey = process.env.GROQ_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!groqKey && !openaiKey && !geminiKey) {
    console.error("No API Keys found!");
    return res.status(500).json({ error: "API Key Error. Check backend .env" });
  }

  const systemPrompt = `You are Stay FIT AI Coach, a wellness and recovery intelligence system.

You analyze user fitness and mental recovery data.

You DO NOT give medical advice.

You respond in short, structured coaching format.

INPUT DATA:
- Mood: ${mood}
- Sleep: ${sleep}%
- Energy: ${energy}%
- Stress: ${stress}%
- Workout Intensity: ${workout}%
- Burnout Risk Score: ${burnoutScore}%
- Recovery Score: ${recoveryScore}%

TASK:
1. Interpret the user's current state in 1 line.
2. Give 1 physical recommendation.
3. Give 1 mental recommendation.
4. Give 1 motivation line.

STYLE:
- concise
- friendly
- coach-like
- no emojis spam
- no long paragraphs
- must feel like a professional AI wellness system

OUTPUT FORMAT:

STATE:
...
PHYSICAL:
...
MENTAL:
...
MOTIVATION:
...`;

  const messages = [
    { role: "system", content: systemPrompt }
  ];

  if (userPrompt) {
    messages.push({ role: "user", content: userPrompt });
  } else {
    messages.push({ role: "user", content: "Give me my daily coaching brief based on my metrics." });
  }

  const apis = [];
  
  if (groqKey) {
    apis.push({
      name: "Groq",
      endpoint: "https://api.groq.com/openai/v1/chat/completions",
      key: groqKey,
      model: "llama-3.1-8b-instant"
    });
  }
  
  if (openaiKey) {
    apis.push({
      name: "OpenAI",
      endpoint: "https://api.openai.com/v1/chat/completions",
      key: openaiKey,
      model: "gpt-4o-mini"
    });
  }

  const tryGemini = async () => {
    if (!geminiKey) throw new Error("No Gemini key");
    console.log("[Backend] Attempting Gemini...");
    const fetch = (await import('node-fetch')).default;
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: { text: systemPrompt } },
        contents: [{ role: "user", parts: [{ text: userPrompt || "Give me my daily coaching brief based on my metrics." }] }]
      })
    });
    if (!res.ok) throw new Error("Gemini API Error: " + res.status);
    const data = await res.json();
    return data.candidates[0].content.parts[0].text.trim();
  };

  const fetch = (await import('node-fetch')).default;

  for (const api of apis) {
    try {
      console.log(`[Backend] Attempting ${api.name}...`);
      const response = await fetch(api.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${api.key}`
        },
        body: JSON.stringify({
          model: api.model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 300
        })
      });

      if (!response.ok) {
        throw new Error(`${api.name} API error: ${response.status}`);
      }

      const json = await response.json();
      return res.json({ text: json.choices[0].message.content.trim() });
    } catch (error) {
      console.warn(`[Backend] ${api.name} failed:`, error.message);
    }
  }

  try {
    const geminiText = await tryGemini();
    return res.json({ text: geminiText });
  } catch (err) {
    console.error("[Backend] Gemini failed:", err.message);
  }

  console.error("[Backend] ALL API ENDPOINTS FAILED.");
  return res.json({ 
    text: "STATE:\nError connecting to intelligence matrix.\n\nPHYSICAL:\nRest and try again later.\n\nMENTAL:\nStay calm.\n\nMOTIVATION:\nWe will be back online shortly." 
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Secure AI Backend running on http://localhost:${PORT}`);
});
