import React, { useState, useMemo } from 'react';
import { CAR_CATEGORIES, MOCK_MODELS } from '../api/carApi';
import { ChevronRight, ChevronLeft, Search, Globe } from 'lucide-react';
import { CarData } from '../types';

interface ManualSelectionProps {
  onComplete: (car: CarData) => void;
}

export const ManualSelection: React.FC<ManualSelectionProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState<Partial<CarData>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSelect = (key: keyof CarData, value: string) => {
    const newSelection = { ...selection, [key]: value };
    setSelection(newSelection);
    
    if (key === 'make') {
      setStep(2);
      setSearchQuery('');
    }
    else if (key === 'model') setStep(3);
    else if (key === 'year') setStep(4);
    else if (key === 'engine') {
      onComplete(newSelection as CarData);
    }
  };

  const filteredMakes = useMemo(() => {
    let makes: string[] = [];
    if (selectedCategory) {
      makes = CAR_CATEGORIES[selectedCategory as keyof typeof CAR_CATEGORIES] || [];
    } else {
      makes = Object.values(CAR_CATEGORIES).flat();
    }

    if (searchQuery) {
      return makes.filter(m => m.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return makes;
  }, [selectedCategory, searchQuery]);

  const years = Array.from({ length: 40 }, (_, i) => (2026 - i).toString());
  const engines = ['Бензин 1.6', 'Бензин 2.0', 'Бензин 2.5', 'Бензин 3.0', 'Бензин 3.5', 'Дизель 2.0', 'Дизель 3.0', 'Гибрид', 'Электро'];

  return (
    <div className="flex flex-col gap-4 bg-[var(--tg-theme-secondary-bg-color)] p-4 rounded-2xl">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold">
          {step === 1 && 'Выберите марку'}
          {step === 2 && 'Выберите модель'}
          {step === 3 && 'Выберите год'}
          {step === 4 && 'Выберите двигатель'}
        </h3>
        {step > 1 && (
          <button 
            onClick={() => setStep(step - 1)}
            className="text-sm text-[var(--tg-theme-button-color)] flex items-center gap-1"
          >
            <ChevronLeft size={16} /> Назад
          </button>
        )}
      </div>

      {step === 1 && (
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={18} />
            <input
              type="text"
              placeholder="Поиск марки..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 pl-10 rounded-xl bg-[var(--tg-theme-bg-color)] border border-black/5 outline-none focus:border-[var(--tg-theme-button-color)] text-sm"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap border ${
                !selectedCategory ? 'bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] border-transparent' : 'bg-[var(--tg-theme-bg-color)] border-black/5'
              }`}
            >
              Все
            </button>
            {Object.keys(CAR_CATEGORIES).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap border ${
                  selectedCategory === cat ? 'bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] border-transparent' : 'bg-[var(--tg-theme-bg-color)] border-black/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
        {step === 1 && filteredMakes.map(make => (
          <button
            key={make}
            onClick={() => handleSelect('make', make)}
            className="flex items-center justify-between p-3 rounded-xl bg-[var(--tg-theme-bg-color)] hover:opacity-80 transition-opacity"
          >
            <span className="text-sm">{make}</span>
            <ChevronRight size={18} className="opacity-30" />
          </button>
        ))}

        {step === 2 && (MOCK_MODELS[selection.make!] || ['Стандартная модель 1', 'Стандартная модель 2']).map(model => (
          <button
            key={model}
            onClick={() => handleSelect('model', model)}
            className="flex items-center justify-between p-3 rounded-xl bg-[var(--tg-theme-bg-color)] hover:opacity-80 transition-opacity"
          >
            <span className="text-sm">{model}</span>
            <ChevronRight size={18} className="opacity-30" />
          </button>
        ))}

        {step === 3 && years.map(year => (
          <button
            key={year}
            onClick={() => handleSelect('year', year)}
            className="flex items-center justify-between p-3 rounded-xl bg-[var(--tg-theme-bg-color)] hover:opacity-80 transition-opacity"
          >
            <span className="text-sm">{year}</span>
            <ChevronRight size={18} className="opacity-30" />
          </button>
        ))}

        {step === 4 && engines.map(engine => (
          <button
            key={engine}
            onClick={() => handleSelect('engine', engine)}
            className="flex items-center justify-between p-3 rounded-xl bg-[var(--tg-theme-bg-color)] hover:opacity-80 transition-opacity"
          >
            <span className="text-sm">{engine}</span>
            <ChevronRight size={18} className="opacity-30" />
          </button>
        ))}
      </div>
    </div>
  );
};

