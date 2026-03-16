import { CarData } from '../types';
import { GoogleGenAI, Type } from "@google/genai";
import { callOpenRouter } from './openRouterApi';

// VIN Year Table (10th character)
const VIN_YEAR_MAP: Record<string, number[]> = {
  'A': [1980, 2010], 'B': [1981, 2011], 'C': [1982, 2012], 'D': [1983, 2013],
  'E': [1984, 2014], 'F': [1985, 2015], 'G': [1986, 2016], 'H': [1987, 2017],
  'J': [1988, 2018], 'K': [1989, 2019], 'L': [1990, 2020], 'M': [1991, 2021],
  'N': [1992, 2022], 'P': [1993, 2023], 'R': [1994, 2024], 'S': [1995, 2025],
  'T': [1996, 2026], 'V': [1997, 2027], 'W': [1998, 2028], 'X': [1999, 2029],
  'Y': [2000, 2030], '1': [2001, 2031], '2': [2002, 2032], '3': [2003, 2033],
  '4': [2004, 2034], '5': [2005, 2035], '6': [2006, 2036], '7': [2007, 2037],
  '8': [2008, 2038], '9': [2009, 2039]
};

export function getYearFromVin(vin: string): string {
  if (vin.length < 10) return '';
  const char = vin.charAt(9).toUpperCase();
  const years = VIN_YEAR_MAP[char];
  if (!years) return '';
  return years[1] <= 2026 ? years[1].toString() : years[0].toString();
}

async function fetchNhtsaData(vin: string) {
  try {
    const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`);
    const data = await res.json();
    const results = data.Results || [];
    const getValue = (variable: string) => {
      const item = results.find((r: any) => r.Variable === variable);
      return item && item.Value !== 'Not Applicable' && item.Value !== 'null' ? item.Value : '';
    };
    
    const make = getValue('Make');
    const model = getValue('Model');
    const year = getValue('Model Year');
    const engineLiters = getValue('Displacement (L)');
    const fuelType = getValue('Fuel Type - Primary');
    
    if (!make) return null;
    
    return { make, model, year, engineLiters, fuelType };
  } catch (e) {
    console.error("NHTSA error:", e);
    return null;
  }
}

function extractJson(text: string) {
  try {
    return JSON.parse(text);
  } catch (e) {
    const match = text.match(/```(?:json)?\n([\s\S]*?)\n```/);
    if (match) {
      try { return JSON.parse(match[1]); } catch (e2) {}
    }
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
      try { return JSON.parse(text.substring(start, end + 1)); } catch (e3) {}
    }
    return null;
  }
}

export async function decodeVinWithAi(vin: string): Promise<CarData | null> {
  const basePrompt = `
    Ты — эксперт-автомеханик и специалист по VIN-кодам. Твоя задача — абсолютно точно расшифровать VIN: ${vin}.
    
    ИНСТРУКЦИЯ:
    1. Сначала проанализируй структуру VIN (WMI, VDS, VIS).
    2. Используй свои знания и поиск, чтобы найти точную модификацию автомобиля.
    3. Если это Mercedes-Benz, обрати внимание на первые символы (например, W1K — Mercedes-Benz AG).
    4. Найди точную модель и поколение (например, S-Class W223 350 d).
    5. Определи код двигателя (например, OM 656.929) и тип трансмиссии.
    6. Найди заправочные объемы: моторное масло (л), антифриз (л), масло в КПП (л).
    
    ВАЖНО: Не выдумывай данные. Если ты не уверен, используй поиск. 
    Например, для VIN w1k6f3ab9na092131 это ДОЛЖЕН БЫТЬ Mercedes-Benz S-Class (W223) 350 d.
    
    Верни ответ СТРОГО в формате JSON. Не пиши ничего, кроме JSON.
    Формат:
    {
      "make": "Марка",
      "model": "Модель и поколение (например, S-Class W223 350 d)",
      "year": "Год",
      "engine": "Объем и тип двигателя (например, 2.9L Diesel)",
      "engineCode": "Код двигателя (например, OM 656.929)",
      "bodyType": "Тип кузова",
      "country": "Страна производства",
      "engineOilVolume": "Объем масла ДВС (например, 6.5 л)",
      "transmission": "Тип КПП (например, 9G-TRONIC)",
      "transmissionVolume": "Объем масла КПП (например, 9.0 л)",
      "antifreezeVolume": "Объем антифриза (например, 12.0 л)"
    }
  `;

  const deepSearchPrompt = `
    ${basePrompt}
    
    ДОПОЛНИТЕЛЬНО: Проведи глубокий поиск по базам данных запчастей и форумам, чтобы найти точные заправочные объемы и артикулы фильтров для этого VIN. 
    Если VIN не пробивается стандартно, попробуй найти аналогичные модели по VIS (последние 7 знаков).
  `;

  try {
    // 1. ПРИОРИТЕТ: Qwen Max (самый мощный и "думающий" из доступных)
    if (process.env.OPENROUTER_API_KEY) {
      try {
        console.log('Attempting Qwen Max decode...');
        const result = await callOpenRouter(basePrompt, "qwen/qwen-max");
        if (result) {
          const aiResult = extractJson(result);
          if (aiResult && aiResult.make && aiResult.make !== 'Unknown') {
            console.log('Qwen Max success:', aiResult.make, aiResult.model);
            return { ...aiResult, vin: vin.toUpperCase() };
          }
        }
      } catch (qwenError) {
        console.error('Qwen Max VIN Decode Error:', qwenError);
      }
    }

    // 2. ЗАПАСНОЙ ВАРИАНТ: Gemini с Google Search (Deep Search)
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
    try {
      console.log('Attempting Gemini Search decode...');
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: deepSearchPrompt,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      const text = response.text;
      if (text) {
        const aiResult = extractJson(text);
        if (aiResult && aiResult.make && aiResult.make !== 'Unknown') {
          console.log('Gemini Search success:', aiResult.make, aiResult.model);
          return { ...aiResult, vin: vin.toUpperCase() };
        }
      }
    } catch (searchError) {
      console.error('Gemini Search VIN Decode Error:', searchError);
    }

    // 3. ПОСЛЕДНИЙ ВАРИАНТ: Стандартный Gemini
    console.log('Attempting Standard Gemini decode...');
    const fallbackResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: basePrompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const fallbackText = fallbackResponse.text;
    if (fallbackText) {
      const aiResult = extractJson(fallbackText);
      if (aiResult && aiResult.make) {
        return { ...aiResult, vin: vin.toUpperCase() };
      }
    }

  } catch (error) {
    console.error('Final VIN Decode Error:', error);
  }

  return null;
}

// Categories for manual selection
export const CAR_CATEGORIES = {
  'Япония': ['Toyota', 'Lexus', 'Honda', 'Acura', 'Nissan', 'Infiniti', 'Mazda', 'Subaru', 'Mitsubishi', 'Suzuki', 'Daihatsu', 'Isuzu'],
  'Корея': ['Hyundai', 'Kia', 'Genesis', 'KG Mobility (SsangYong)'],
  'Китай': [
    'BYD', 'Geely', 'Chery', 'Changan', 'Great Wall', 'Haval', 'Tank', 'Wey', 'NIO', 'XPeng', 
    'Li Auto', 'Zeekr', 'Lynk & Co', 'Exeed', 'Jetour', 'Omoda', 'Jaecoo', 'Hongqi', 'Wuling', 
    'Baojun', 'Leapmotor', 'Aito', 'Deepal', 'Avatr', 'Yangwang', 'HiPhi', 'IM Motors', 'Voyah', 
    'Seres', 'Dongfeng', 'FAW', 'BAIC', 'GAC Trumpchi', 'SAIC Maxus', 'Roewe', 'MG'
  ],
  'Европа': [
    'Volkswagen', 'Audi', 'Porsche', 'Skoda', 'Seat', 'Cupra', 'Bentley', 'Lamborghini', 
    'BMW', 'Mini', 'Rolls-Royce', 'Mercedes-Benz', 'Maybach', 'Smart', 'Peugeot', 'Citroën', 
    'Opel', 'Vauxhall', 'Fiat', 'Alfa Romeo', 'Jeep', 'Lancia', 'DS', 'Maserati', 'Renault', 
    'Dacia', 'Volvo', 'Jaguar', 'Land Rover', 'Tesla', 'Polestar'
  ],
  'США': ['Ford', 'Chevrolet', 'GMC', 'Cadillac', 'Buick', 'Dodge', 'Ram', 'Chrysler', 'Lincoln', 'Rivian', 'Lucid', 'Fisker', 'AMC'],
  'Россия': ['LADA', 'УАЗ', 'ГАЗ', 'Москвич', 'Evolute', 'Amber', 'Volga']
};

export const POPULAR_MAKES = Object.values(CAR_CATEGORIES).flat();

export const MOCK_MODELS: Record<string, string[]> = {
  'Toyota': ['Camry', 'RAV4', 'Corolla', 'Land Cruiser', 'Prado', 'Hilux', 'Mark II', 'Chaser'],
  'Lexus': ['RX', 'NX', 'LX', 'IS', 'ES', 'GS'],
  'BMW': ['3 Series', '5 Series', 'X5', 'X3', '7 Series', 'M5'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLE', 'GLC', 'G-Class'],
  'Hyundai': ['Solaris', 'Creta', 'Tucson', 'Santa Fe', 'Elantra', 'Palisade'],
  'Kia': ['Rio', 'Sportage', 'Sorento', 'Optima', 'K5', 'Ceed'],
  'LADA': ['Granta', 'Vesta', 'Niva Legend', 'Niva Travel', 'Largus', 'XRAY'],
  'Geely': ['Monjaro', 'Coolray', 'Atlas', 'Tugella', 'Emgrand'],
  'Haval': ['Jolion', 'F7', 'Dargo', 'H6', 'H9'],
  'Chery': ['Tiggo 7 Pro', 'Tiggo 8 Pro', 'Tiggo 4', 'Arrizo 8'],
  'Zeekr': ['001', '009', 'X', '007'],
  'Li Auto': ['L7', 'L8', 'L9', 'One'],
  'BYD': ['Han', 'Tang', 'Song', 'Qin', 'Seal'],
  'Tesla': ['Model 3', 'Model Y', 'Model S', 'Model X'],
  'Volkswagen': ['Polo', 'Tiguan', 'Passat', 'Golf', 'Touareg', 'Teramont'],
  'Skoda': ['Octavia', 'Rapid', 'Kodiaq', 'Superb', 'Karoq'],
  'Audi': ['A4', 'A6', 'Q5', 'Q7', 'A8', 'Q3'],
  'Mazda': ['CX-5', '6', '3', 'CX-9', 'CX-30'],
  'Nissan': ['Qashqai', 'X-Trail', 'Juke', 'Patrol', 'Teana'],
  'Mitsubishi': ['Outlander', 'Pajero', 'Lancer', 'ASX', 'L200'],
  'Subaru': ['Forester', 'Outback', 'XV', 'Impreza'],
  'Changan': ['UNI-K', 'UNI-V', 'CS55 Plus', 'CS35 Plus'],
  'Exeed': ['TXL', 'VX', 'LX', 'RX'],
  'Tank': ['300', '500'],
  'Москвич': ['3', '3e', '6'],
  'УАЗ': ['Patriot', 'Hunter', 'Pickup'],
};


