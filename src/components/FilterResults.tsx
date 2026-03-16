import React from 'react';
import { Filter, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { CarData, FilterRecommendation } from '../types';
import { motion } from 'motion/react';

interface FilterResultsProps {
  car: CarData;
}

export const FilterResults: React.FC<FilterResultsProps> = ({ car }) => {
  // Filters will be provided by the AI recommendation below
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-[var(--tg-theme-secondary-bg-color)] rounded-3xl overflow-hidden border border-black/5 shadow-2xl">
        <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Filter size={18} />
            <h3 className="font-black text-xs uppercase tracking-[0.2em]">Подбор фильтров</h3>
          </div>
          <Sparkles size={18} className="text-amber-400 animate-pulse" />
        </div>
        
        <div className="p-8 text-center flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center">
            <Search className="opacity-20" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-black uppercase tracking-widest">Артикулы в процессе подбора</p>
            <p className="text-[10px] opacity-40 font-bold">ИИ анализирует каталоги Vic, Micro, Mann и Filtron для {car.model}</p>
          </div>
        </div>
      </div>

      <div className="bg-zinc-100 p-3 rounded-2xl border border-black/5 flex items-start gap-3">
        <ShieldCheck size={16} className="text-zinc-400 shrink-0 mt-0.5" />
        <p className="text-[10px] opacity-50 font-medium leading-tight">
          Точные артикулы фильтров будут указаны в развернутой рекомендации ИИ ниже после завершения анализа.
        </p>
      </div>
    </div>
  );
};
