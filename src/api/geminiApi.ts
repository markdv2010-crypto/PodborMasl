import { GoogleGenAI } from "@google/genai";
import { CarData, SurveyData } from "../types";
import { callOpenRouter } from './openRouterApi';

const MODELS = [
  "gemini-3-flash-preview",
  "gemini-2.5-flash",
  "gemini-3.1-flash-lite-preview"
];

export async function getAiRecommendation(car: CarData, survey: SurveyData): Promise<{ text: string, model: string }> {
  try {
    const response = await fetch('/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ car, survey })
    });

    if (!response.ok) throw new Error('Backend error');
    const data = await response.json();
    
    return { text: data.text, model: "Qwen 3.5 Expert (Backend)" };
  } catch (error) {
    console.error('Recommendation Error:', error);
    return { 
      text: "К сожалению, ИИ сейчас недоступен. Пожалуйста, следуйте рекомендациям RAVENOL из таблицы выше.", 
      model: "none" 
    };
  }
}

