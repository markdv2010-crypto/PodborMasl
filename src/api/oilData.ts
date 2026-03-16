import { OilRecommendation } from "../types";

export const MOCK_OIL_DATA: OilRecommendation[] = [
  {
    unit: "Двигатель",
    viscosity: "5W-30",
    specification: "ACEA C3, API SN",
    volume: "4.5 л",
    interval: "7,500 - 10,000 км"
  },
  {
    unit: "АКПП / МКПП",
    viscosity: "ATF / 75W-90",
    specification: "Зависит от типа КПП",
    volume: "6.0 л (полная)",
    interval: "60,000 км"
  },
  {
    unit: "Раздаточная коробка",
    viscosity: "75W-90",
    specification: "GL-5",
    volume: "0.8 л",
    interval: "40,000 км"
  },
  {
    unit: "Передний мост",
    viscosity: "75W-85",
    specification: "GL-5",
    volume: "1.1 л",
    interval: "40,000 км"
  },
  {
    unit: "Задний мост",
    viscosity: "75W-85",
    specification: "GL-5",
    volume: "1.3 л",
    interval: "40,000 км"
  },
  {
    unit: "ГУР",
    viscosity: "PSF",
    specification: "Спецификация производителя",
    volume: "1.0 л",
    interval: "50,000 км"
  },
  {
    unit: "Тормозная жидкость",
    viscosity: "DOT 4",
    specification: "ISO 4925 Class 4",
    volume: "0.7 л",
    interval: "2 года"
  }
];

export function getRavenolLink(car: any): string {
  // In a real app, we'd map car data to Ravenol internal IDs
  // For now, we'll just link to the main search page or a search query if possible
  const query = encodeURIComponent(`${car.make} ${car.model} ${car.year}`);
  return `https://choise.ravenol.com/`;
}
