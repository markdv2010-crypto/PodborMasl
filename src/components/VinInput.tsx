import React, { useState } from 'react';
import { Search, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface VinInputProps {
  onSearch: (vin: string) => void;
  loading?: boolean;
}

export const VinInput: React.FC<VinInputProps> = ({ onSearch, loading }) => {
  const [vin, setVin] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vin.length === 17) {
      onSearch(vin.toUpperCase());
    } else {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 px-1">
        <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
          Поиск по VIN <Sparkles size={20} className="text-[var(--tg-theme-button-color)]" />
        </h2>
        <p className="text-sm opacity-50 font-medium">ИИ расшифрует данные автомобиля за секунды</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="relative group">
          <input
            type="text"
            value={vin}
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            placeholder="Введите 17 символов VIN"
            maxLength={17}
            disabled={loading}
            className="w-full bg-[var(--tg-theme-secondary-bg-color)] text-[var(--tg-theme-text-color)] p-5 pl-14 rounded-2xl border-2 border-transparent focus:border-[var(--tg-theme-button-color)] outline-none transition-all font-mono text-lg tracking-widest placeholder:text-xs placeholder:font-sans placeholder:tracking-normal placeholder:opacity-30 disabled:opacity-50"
          />
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--tg-theme-button-color)]">
            {loading ? <Loader2 size={24} className="animate-spin" /> : <Search size={24} />}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={vin.length !== 17 || loading}
          className="w-full py-5 rounded-2xl bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] font-black uppercase tracking-widest shadow-lg shadow-[var(--tg-theme-button-color)]/20 disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Анализирую...</span>
            </>
          ) : (
            <>
              <Sparkles size={20} />
              <span>Расшифровать ИИ</span>
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
};


