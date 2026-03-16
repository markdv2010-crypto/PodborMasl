export interface CarData {
  make: string;
  model: string;
  year: string;
  engine?: string;
  engineCode?: string;
  bodyType?: string;
  country?: string;
  vin?: string;
  engineOilVolume?: string;
  transmission?: string;
  transmissionVolume?: string;
  antifreezeVolume?: string;
}

export interface FilterRecommendation {
  type: 'Oil' | 'Air' | 'Cabin' | 'Fuel';
  vic?: string;
  micro?: string;
  mann?: string;
  filtron?: string;
}

export interface OilRecommendation {
  unit: string;
  viscosity: string;
  specification: string;
  volume: string;
  interval: string;
}

export interface SurveyData {
  climate: 'cold' | 'moderate' | 'hot';
  annualMileage: string;
  drivingStyle: 'calm' | 'dynamic' | 'aggressive';
  carAge: string;
  totalMileage: string;
}

export interface SearchHistoryItem {
  id: string;
  car: CarData;
  timestamp: number;
}

declare global {
  interface Window {
    Telegram: {
      WebApp: any;
    };
  }
}
