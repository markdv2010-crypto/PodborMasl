import React, { useState } from 'react';
import { CarData } from '../types';
import { ChevronRight, Save } from 'lucide-react';

interface ManualEntryProps {
  initialData?: Partial<CarData>;
  onComplete: (car: CarData) => void;
}

export const ManualEntry: React.FC<ManualEntryProps> = ({ initialData, onComplete }) => {
  const [formData, setFormData] = useState<CarData>({
    make: initialData?.make || '',
    model: initialData?.model || '',
    year: initialData?.year || '',
    engine: initialData?.engine || '',
    engineCode: initialData?.engineCode || '',
    vin: initialData?.vin || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.make && formData.model && formData.year) {
      onComplete(formData);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-[var(--tg-theme-secondary-bg-color)] p-5 rounded-2xl flex flex-col gap-4 shadow-sm border border-black/5">
        <h3 className="font-bold text-sm uppercase opacity-40">Введите данные автомобиля</h3>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase opacity-40 ml-1">Марка</label>
            <input
              type="text"
              placeholder="Например: LADA"
              value={formData.make}
              onChange={(e) => setFormData({ ...formData, make: e.target.value })}
              className="w-full p-3 rounded-xl bg-[var(--tg-theme-bg-color)] border border-black/5 outline-none focus:border-[var(--tg-theme-button-color)] text-sm"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase opacity-40 ml-1">Модель</label>
            <input
              type="text"
              placeholder="Например: Niva"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full p-3 rounded-xl bg-[var(--tg-theme-bg-color)] border border-black/5 outline-none focus:border-[var(--tg-theme-button-color)] text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase opacity-40 ml-1">Год</label>
              <input
                type="text"
                placeholder="2006"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full p-3 rounded-xl bg-[var(--tg-theme-bg-color)] border border-black/5 outline-none focus:border-[var(--tg-theme-button-color)] text-sm"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase opacity-40 ml-1">Двигатель</label>
              <input
                type="text"
                placeholder="1.7"
                value={formData.engine}
                onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
                className="w-full p-3 rounded-xl bg-[var(--tg-theme-bg-color)] border border-black/5 outline-none focus:border-[var(--tg-theme-button-color)] text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase opacity-40 ml-1">Код/Название двигателя (опционально)</label>
            <input
              type="text"
              placeholder="Например: 1JZ-GTE, M54B30"
              value={formData.engineCode}
              onChange={(e) => setFormData({ ...formData, engineCode: e.target.value })}
              className="w-full p-3 rounded-xl bg-[var(--tg-theme-bg-color)] border border-black/5 outline-none focus:border-[var(--tg-theme-button-color)] text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-4 rounded-xl bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] font-bold flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform"
          >
            <Save size={18} />
            Показать результаты подбора
          </button>
        </form>
      </div>
    </div>
  );
};
