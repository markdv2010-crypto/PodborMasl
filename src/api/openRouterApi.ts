import { CarData } from '../types';

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function callOpenRouter(prompt: string, model: string = "qwen/qwen-max"): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error("OpenRouter API key is missing");
    return null;
  }

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.APP_URL || "https://maslomarket.ai",
        "X-Title": "MasloMARKET Podbor AI",
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      console.error("OpenRouter API error:", await response.text());
      return null;
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("OpenRouter API error:", error);
    return null;
  }
}
