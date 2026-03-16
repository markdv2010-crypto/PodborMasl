import React from 'react';
import { Droplets, Info, ShieldCheck } from 'lucide-react';
import { CarData } from '../types';
import { motion } from 'motion/react';

interface OilResultsProps {
  car: CarData;
}

export const OilResults: React.FC<OilResultsProps> = ({ car }) => {
  // Mock technical data based on car details
  const recommendations = [
    { unit: 'Двигатель', viscosity: '5W-30', volume: '4.5 л', ravenol: 'VMP / SSL' },
    { unit: 'АКПП / Вариатор', viscosity: 'ATF / CVTF', volume: '7.2 л', ravenol: 'T-WS / NS3' },
    { unit: 'Редуктор / Мост', viscosity: '75W-90', volume: '1.1 л', ravenol: 'DGL / VSG' },
    { unit: 'Тормозная система', viscosity: 'DOT 4', volume: '1.0 л', ravenol: 'DOT4 Class 6' },
    { unit: 'Антифриз', viscosity: 'G12++ / P-OAT', volume: '8.5 л', ravenol: 'OTC / HJC' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-[var(--tg-theme-secondary-bg-color)] rounded-3xl overflow-hidden border border-black/5 shadow-2xl">
        <div className="bg-gradient-to-r from-[var(--tg-theme-button-color)] to-blue-600 p-4 flex items-center justify-between text-[var(--tg-theme-button-text-color)]">
          <div className="flex items-center gap-2">
            <Droplets size={18} />
            <h3 className="font-black text-xs uppercase tracking-[0.2em]">Технические жидкости</h3>
          </div>
          <ShieldCheck size={18} className="opacity-50" />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="bg-black/5">
                <th className="p-4 font-black uppercase tracking-widest opacity-30">Узел</th>
                <th className="p-4 font-black uppercase tracking-widest opacity-30">Вязкость</th>
                <th className="p-4 font-black uppercase tracking-widest opacity-30 text-right">RAVENOL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {recommendations.map((rec, i) => (
                <motion.tr 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="active:bg-black/5 transition-colors"
                >
                  <td className="p-4">
                    <div className="font-black uppercase tracking-tight">{rec.unit}</div>
                    <div className="text-[9px] opacity-40 font-bold">Объём: {rec.volume}</div>
                  </td>
                  <td className="p-4 font-bold opacity-60">{rec.viscosity}</td>
                  <td className="p-4 text-right">
                    <span className="inline-block px-2 py-1 rounded-md bg-[var(--tg-theme-button-color)]/10 text-[var(--tg-theme-button-color)] font-black text-[10px] tracking-tighter">
                      {rec.ravenol}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 opacity-30">
        <Info size={12} />
        <span className="text-[9px] font-bold uppercase tracking-widest leading-none">Данные носят справочный характер. Проверяйте по VIN.</span>
      </div>
    </div>
  );
};


