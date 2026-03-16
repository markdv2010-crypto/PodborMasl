import React from 'react';
import { Sparkles, ShieldAlert, Cpu } from 'lucide-react';
import Markdown from 'react-markdown';

interface AiRecommendationProps {
  text: string;
  loading: boolean;
}

export const AiRecommendation: React.FC<AiRecommendationProps> = ({ text, loading }) => {
  if (loading) {
    return (
      <div className="bg-[var(--tg-theme-secondary-bg-color)] p-6 rounded-2xl flex flex-col items-center gap-4 border border-[var(--tg-theme-button-color)]/20 shadow-xl">
        <div className="relative">
          <Sparkles className="text-[var(--tg-theme-button-color)] animate-pulse" size={32} />
          <div className="absolute inset-0 animate-ping opacity-20 bg-[var(--tg-theme-button-color)] rounded-full"></div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-bold text-[var(--tg-theme-button-color)]">MasloMARKET AI думает...</p>
          <p className="text-[10px] opacity-50">Анализируем климат и стиль вождения</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--tg-theme-secondary-bg-color)] p-5 rounded-2xl flex flex-col gap-4 border border-[var(--tg-theme-button-color)]/20 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[var(--tg-theme-button-color)]">
          <Sparkles size={20} />
          <h3 className="font-bold">Рекомендация MasloMARKET AI</h3>
        </div>
        <div className="flex items-center gap-1 opacity-30 text-[10px] font-mono">
          <Cpu size={10} />
          <span>Gemini Flash</span>
        </div>
      </div>

      <div className="text-sm leading-relaxed prose prose-sm dark:prose-invert">
        <Markdown>{text}</Markdown>
      </div>

      <div className="mt-2 p-3 bg-red-500/5 rounded-lg flex gap-2 items-start border border-red-500/10">
        <ShieldAlert size={16} className="text-red-500 shrink-0 mt-0.5" />
        <p className="text-[10px] text-red-500/80 leading-tight italic">
          Внимание: Информация предоставлена ИИ и носит справочный характер. Всегда проверяйте допуски в официальном каталоге RAVENOL.
        </p>
      </div>
    </div>
  );
};

