import React, { useState } from 'react';
import { SurveyData } from '../types';
import { Thermometer, Navigation, Zap, History } from 'lucide-react';

interface AiSurveyProps {
  onComplete: (data: SurveyData) => void;
}

export const AiSurvey: React.FC<AiSurveyProps> = ({ onComplete }) => {
  const [survey, setSurvey] = useState<SurveyData>({
    climate: 'moderate',
    annualMileage: '15000',
    drivingStyle: 'calm',
    carAge: '5',
    totalMileage: '100000'
  });

  const handleSubmit = () => {
    onComplete(survey);
  };

  return (
    <div className="bg-[var(--tg-theme-secondary-bg-color)] p-5 rounded-2xl flex flex-col gap-5">
      <div className="text-center">
        <h3 className="font-bold text-lg">ИИ-рекомендация</h3>
        <p className="text-xs opacity-60">Ответьте на 4 вопроса для точного подбора</p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Climate */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase opacity-40 flex items-center gap-1">
            <Thermometer size={12} /> Климат эксплуатации
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['cold', 'moderate', 'hot'] as const).map(c => (
              <button
                key={c}
                onClick={() => setSurvey({ ...survey, climate: c })}
                className={`p-2 rounded-lg text-xs transition-all border ${
                  survey.climate === c 
                    ? 'bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] border-transparent' 
                    : 'bg-[var(--tg-theme-bg-color)] border-black/5'
                }`}
              >
                {c === 'cold' ? 'Холодный' : c === 'hot' ? 'Жаркий' : 'Умеренный'}
              </button>
            ))}
          </div>
        </div>

        {/* Driving Style */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase opacity-40 flex items-center gap-1">
            <Zap size={12} /> Стиль вождения
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['calm', 'dynamic', 'aggressive'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSurvey({ ...survey, drivingStyle: s })}
                className={`p-2 rounded-lg text-xs transition-all border ${
                  survey.drivingStyle === s 
                    ? 'bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] border-transparent' 
                    : 'bg-[var(--tg-theme-bg-color)] border-black/5'
                }`}
              >
                {s === 'calm' ? 'Спокойный' : s === 'aggressive' ? 'Агрессивный' : 'Динамичный'}
              </button>
            ))}
          </div>
        </div>

        {/* Mileage Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase opacity-40 flex items-center gap-1">
              <Navigation size={12} /> Пробег в год (км)
            </label>
            <input
              type="number"
              value={survey.annualMileage}
              onChange={(e) => setSurvey({ ...survey, annualMileage: e.target.value })}
              className="p-2 rounded-lg bg-[var(--tg-theme-bg-color)] border border-black/5 outline-none focus:border-[var(--tg-theme-button-color)] text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase opacity-40 flex items-center gap-1">
              <History size={12} /> Общий пробег (км)
            </label>
            <input
              type="number"
              value={survey.totalMileage}
              onChange={(e) => setSurvey({ ...survey, totalMileage: e.target.value })}
              className="p-2 rounded-lg bg-[var(--tg-theme-bg-color)] border border-black/5 outline-none focus:border-[var(--tg-theme-button-color)] text-sm"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-3 rounded-xl bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] font-bold shadow-lg active:scale-95 transition-transform"
      >
        Получить рекомендацию ИИ
      </button>
    </div>
  );
};
