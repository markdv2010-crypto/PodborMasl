import React from 'react';
import { CarData } from '../types';
import { Car, Calendar, MapPin, Sparkles, Settings } from 'lucide-react';

interface CarInfoProps {
  car: CarData;
}

export const CarInfo: React.FC<CarInfoProps> = ({ car }) => {
  return (
    <div className="bg-[var(--tg-theme-secondary-bg-color)] rounded-3xl p-6 border border-black/5 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Car size={120} />
      </div>
      
      <div className="flex flex-col gap-6 relative">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 text-[var(--tg-theme-button-color)]">
              <Sparkles size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Автомобиль идентифицирован</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 rounded-full">
              <span className="text-[8px] font-black text-blue-600 uppercase tracking-tighter">Qwen 3.5 Expert</span>
            </div>
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tight leading-none">
            {car.make} {car.model}
          </h2>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm opacity-60 font-bold">{car.engine || 'Двигатель не указан'}</p>
            {car.engineCode && (
              <p className="text-[10px] font-mono text-[var(--tg-theme-button-color)] font-black uppercase tracking-widest">
                Код: {car.engineCode}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-black/5 p-4 rounded-2xl flex flex-col gap-1 border border-black/5">
            <div className="flex items-center gap-2 opacity-30">
              <Calendar size={12} />
              <span className="text-[10px] font-black uppercase tracking-widest">Год выпуска</span>
            </div>
            <span className="text-lg font-black">{car.year}</span>
          </div>
          
          <div className="bg-black/5 p-4 rounded-2xl flex flex-col gap-1 border border-black/5">
            <div className="flex items-center gap-2 opacity-30">
              <MapPin size={12} />
              <span className="text-[10px] font-black uppercase tracking-widest">Регион</span>
            </div>
            <span className="text-lg font-black">{car.country || 'Неизвестно'}</span>
          </div>
        </div>

        {(car.engineOilVolume || car.transmission || car.antifreezeVolume) && (
          <div className="bg-black/5 p-4 rounded-2xl flex flex-col gap-3 border border-black/5 mt-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Заправочные объемы (справочно)</h3>
            
            {car.engineOilVolume && (
              <div className="flex justify-between items-center border-b border-black/5 pb-2">
                <span className="text-xs font-bold opacity-60">Моторное масло</span>
                <span className="text-sm font-black">{car.engineOilVolume}</span>
              </div>
            )}
            
            {(car.transmission || car.transmissionVolume) && (
              <div className="flex justify-between items-center border-b border-black/5 pb-2">
                <span className="text-xs font-bold opacity-60">КПП {car.transmission ? `(${car.transmission})` : ''}</span>
                <span className="text-sm font-black">{car.transmissionVolume || 'Неизвестно'}</span>
              </div>
            )}
            
            {car.antifreezeVolume && (
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold opacity-60">Антифриз</span>
                <span className="text-sm font-black">{car.antifreezeVolume}</span>
              </div>
            )}
          </div>
        )}

        {car.bodyType && (
          <div className="flex items-center gap-2 px-1 mt-2">
            <Settings size={14} className="opacity-30" />
            <span className="text-xs font-bold opacity-40 uppercase tracking-widest">Кузов: {car.bodyType}</span>
          </div>
        )}
      </div>
    </div>
  );
};

