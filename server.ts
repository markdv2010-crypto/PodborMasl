import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper for OpenRouter
async function callOpenRouter(prompt: string, model: string = "qwen/qwen-max") {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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

    if (!response.ok) return null;
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("OpenRouter Error:", error);
    return null;
  }
}

// VIN Decoding API
app.post("/api/decode-vin", async (req, res) => {
  const { vin } = req.body;
  if (!vin || vin.length !== 17) {
    return res.status(400).json({ error: "Invalid VIN length" });
  }

  const prompt = `
    Ты — Qwen 3.5 Expert VIN Decoder + Ravenol Oil Specialist.
    Твоя задача: максимально ЧЁТКО и ТОЧНО расшифровать VIN: ${vin}.
    
    ИНСТРУКЦИЯ:
    1. Начни с пошагового мышления (Chain-of-Thought). Проанализируй структуру VIN (WMI, VDS, VIS).
    2. Проверь контрольную цифру (9-я позиция).
    3. Используй свои знания и Google Search (если доступно), чтобы найти точную модификацию.
    4. Найди точную модель, год, двигатель (код), трансмиссию и заправочные объемы.
    
    ОТВЕТЬ СТРОГО В ДВУХ ЧАСТЯХ:
    1. Текстовый разбор (Markdown) по формату:
       VIN: [код]
       Валидность: ✅ Да / ❌ Нет
       Основные характеристики: ...
       Пошаговый разбор VIN: ...
       Выводы: ...
    
    2. JSON-объект в конце ответа для парсинга приложением.
       Формат JSON:
       {
         "make": "Марка",
         "model": "Модель",
         "year": "Год",
         "engine": "Двигатель",
         "engineCode": "Код ДВС",
         "bodyType": "Кузов",
         "country": "Страна",
         "engineOilVolume": "Объем масла",
         "transmission": "КПП",
         "transmissionVolume": "Объем КПП",
         "antifreezeVolume": "Объем антифриза"
       }
    
    Никогда не придумывай данные. Если не уверен — пиши "Требуется уточнение".
  `;

  try {
    let result = null;
    
    // 1. Try Qwen Max
    result = await callOpenRouter(prompt);
    
    // 2. Fallback to Gemini Search
    if (!result && process.env.GEMINI_API_KEY) {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
      });
      result = response.text;
    }

    if (!result) throw new Error("AI failed to respond");

    res.json({ text: result });
  } catch (error) {
    console.error("Decode Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Recommendation API
app.post("/api/recommend", async (req, res) => {
  const { car, survey } = req.body;
  
  const prompt = `
    Ты — Qwen 3.5 Expert VIN Decoder + Ravenol Oil Specialist.
    Автомобиль: ${JSON.stringify(car)}
    Опрос: ${JSON.stringify(survey)}
    
    Твоя задача: выдать полный подбор масел Ravenol.
    
    ИНСТРУКЦИЯ:
    1. ИСПОЛЬЗУЙ ПОИСК, чтобы проверить https://podbor.ravenol.ru для этого VIN/авто.
    2. Выдай:
       • Рекомендуемые артикулы Ravenol (моторное, коробка, ГУР и т.д.)
       • Точные объемы заливки
       • Интервалы замены
       • Допуски и спецификации
    
    Отвечай профессионально, на русском языке, в формате Markdown.
    В конце добавь дисклеймер.
  `;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] }
    });
    
    res.json({ text: response.text });
  } catch (error) {
    console.error("Recommend Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
