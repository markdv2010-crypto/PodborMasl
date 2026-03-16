import { GoogleGenAI } from "@google/genai";
import { CarData, SurveyData } from "../types";
import { callOpenRouter } from './openRouterApi';

const MODELS = [
  "gemini-3-flash-preview",
  "gemini-2.5-flash",
  "gemini-3.1-flash-lite-preview"
];

export async function getAiRecommendation(car: CarData, survey: SurveyData): Promise<{ text: string, model: string }> {
  const prompt = `
    Ты эксперт по подбору моторных масел и технических жидкостей MasloMARKET Podbor AI.
    Автомобиль: ${car.make} ${car.model} ${car.year} ${car.engine || ''} ${car.engineCode ? `(Двигатель: ${car.engineCode})` : ''}.
    Объем моторного масла: ${car.engineOilVolume || 'неизвестно'}
    Коробка передач: ${car.transmission || 'неизвестно'} (Объем: ${car.transmissionVolume || 'неизвестно'})
    Объем антифриза: ${car.antifreezeVolume || 'неизвестно'}
    
    Данные опроса владельца:
    - Климат: ${survey.climate === 'cold' ? 'очень холодный (Сибирь/Север)' : survey.climate === 'hot' ? 'жаркий (Дубай/Юг)' : 'умеренный'}
    - Пробег в год: ${survey.annualMileage} км
    - Стиль вождения: ${survey.drivingStyle === 'calm' ? 'спокойный' : survey.drivingStyle === 'aggressive' ? 'агрессивный' : 'динамичный'}
    - Общий пробег: ${survey.totalMileage} км
    
    Твоя задача:
    1. ИСПОЛЬЗУЙ ПОИСК В ИНТЕРНЕТЕ (Google Search), чтобы проверить официальные каталоги подбора масел Ravenol, Motul и Bardahl для этого конкретного автомобиля.
    2. Узнай точные допуски производителя (например, MB 229.52 для Mercedes 350 d).
    
    На основе этих данных сгенерируй профессиональную рекомендацию.
    
    МАСЛА И ЖИДКОСТИ:
    Используй ТОЛЬКО бренды: Ravenol, Motul, Bardahl.
    Учитывай регион, пробег и стиль вождения.
    Напиши конкретные продукты (с точным названием) для:
    1. Моторное масло (с учетом климата и пробега)
    2. Трансмиссионное масло (для указанной КПП)
    3. Антифриз
    Укажи требуемые объемы заливки.
    
    ФИЛЬТРЫ:
    Найди и укажи ТОЧНЫЕ артикулы фильтров (Масляный, Воздушный, Салонный, Топливный) для этого автомобиля. 
    Проверь каталоги:
    - VIC (например, C-110)
    - Micro (например, T-1636)
    - MANN (например, W 68/3)
    - Filtron (например, OP 572)
    
    Если не находишь точный артикул, укажи наиболее вероятный на основе кросс-номеров оригинальных запчастей (OEM).
    
    Объясни кратко, почему именно этот выбор оптимален.
    Отвечай на русском языке. Используй Markdown.
    В конце ОБЯЗАТЕЛЬНО добавь дисклеймер: "Рекомендация ИИ — справочная. Всегда сверяйтесь с официальным допуском в сервисной книжке."
  `;

  // 1. Try Gemini with Google Search first for accurate catalog lookup
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    if (response.text) {
      return { text: response.text, model: "gemini-3-flash-preview (Search)" };
    }
  } catch (e) {
    console.error("Gemini Search Recommendation Error:", e);
  }

  // 2. Fallback to OpenRouter (Qwen Max)
  if (process.env.OPENROUTER_API_KEY) {
    try {
      const result = await callOpenRouter(prompt);
      if (result) {
        return { text: result, model: "qwen/qwen-max" };
      }
    } catch (e) {
      console.error("OpenRouter Recommendation Error:", e);
    }
  }

  // 3. Fallback to standard Gemini models
  for (const modelName of MODELS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
      });
      
      clearTimeout(timeoutId);

      if (response.text) {
        return { text: response.text, model: modelName };
      }
    } catch (error) {
      console.error(`Error with model ${modelName}:`, error);
    }
  }

  return { 
    text: "К сожалению, ИИ сейчас недоступен. Пожалуйста, следуйте рекомендациям RAVENOL из таблицы выше.", 
    model: "none" 
  };
}

