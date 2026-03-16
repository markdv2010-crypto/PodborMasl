import React from 'react';
import { Sparkles, ShieldAlert, Cpu, Brain } from 'lucide-react';
import Markdown from 'react-markdown';

interface AiRecommendationProps {
  text: string;
  loading: boolean;
}

export const AiRecommendation: React.FC<AiRecommendationProps> = ({ text, loading }) => {
  if (loading) {
    return (
      <div className="bg-[var(--tg-theme-secondary-bg-color)] p-8 rounded-3xl flex flex-col items-center gap-6 border border-[var(--tg-theme-button-color)]/20 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent"></div>
        <div className="relative">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center animate-pulse">
            <Brain className="text-blue-500" size={32} />
          </div>
          <div className="absolute -top-1 -right-1">
            <Sparkles className="text-amber-400 animate-bounce" size={20} />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 relative">
          <p className="text-base font-black uppercase tracking-widest text-blue-500">Qwen 3.5 Анализирует...</p>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
          </div>
          <p className="text-[10px] opacity-40 font-bold uppercase tracking-tighter mt-2">Сверяемся с podbor.ravenol.ru</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--tg-theme-secondary-bg-color)] p-6 rounded-3xl flex flex-col gap-5 border border-blue-500/20 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12">
        <Brain size={120} />
      </div>
      
      <div className="flex items-center justify-between relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
            <Sparkles size={22} className="text-blue-500" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-black uppercase tracking-tight text-sm">Экспертный подбор</h3>
            <span className="text-[9px] opacity-40 font-bold uppercase tracking-widest">Ravenol Oil Specialist</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-black/5 rounded-lg opacity-40 text-[9px] font-black uppercase tracking-tighter">
          <Cpu size={10} />
          <span>Qwen Max</span>
        </div>
      </div>

      <div className="text-sm leading-relaxed prose prose-sm max-w-none text-[var(--tg-theme-text-color)] opacity-90 markdown-body relative">
        <Markdown>{text}</Markdown>
      </div>

      <div className="mt-2 p-4 bg-amber-500/5 rounded-2xl flex gap-3 items-start border border-amber-500/10 relative">
        <ShieldAlert size={18} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-[10px] text-amber-600/80 font-bold leading-tight italic">
          Внимание: Рекомендация ИИ — справочная. Всегда сверяйтесь с официальным допуском в сервисной книжке и на сайте podbor.ravenol.ru.
        </p>
      </div>
    </div>
  );
};

