/**
 * aiClient.js
 * Calls the secure backend proxy to protect API keys.
 */

export const generateCoachingText = async (data) => {
  try {
    const response = await fetch("http://localhost:3001/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Proxy error: ${response.status}`);
    }

    const json = await response.json();
    return json.text;
  } catch (error) {
    console.error("AI Proxy Error:", error);
    return "STATE:\nError connecting to intelligence matrix.\n\nPHYSICAL:\nRest and try again later.\n\nMENTAL:\nStay calm.\n\nMOTIVATION:\nWe will be back online shortly.";
  }
};
