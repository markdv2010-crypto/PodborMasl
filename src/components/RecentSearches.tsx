import React from 'react';
import { SearchHistoryItem } from '../types';
import { Clock, ChevronRight } from 'lucide-react';

interface RecentSearchesProps {
  items: SearchHistoryItem[];
  onSelect: (item: SearchHistoryItem) => void;
}

export const RecentSearches: React.FC<RecentSearchesProps> = ({ items, onSelect }) => {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-bold uppercase opacity-40 px-1 flex items-center gap-1">
        <Clock size={12} /> Недавние поиски
      </h3>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="flex items-center justify-between p-3 rounded-xl bg-[var(--tg-theme-secondary-bg-color)] hover:opacity-80 transition-opacity text-left"
          >
            <div className="flex flex-col">
              <span className="font-bold text-sm">{item.car.make} {item.car.model}</span>
              <span className="text-[10px] opacity-50">{item.car.vin || 'Ручной подбор'}</span>
            </div>
            <ChevronRight size={18} className="opacity-30" />
          </button>
        ))}
      </div>
    </div>
  );
};
