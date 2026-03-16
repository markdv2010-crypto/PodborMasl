import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Brain, CheckCircle2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

interface AiVinAnalysisProps {
  text: string;
}

export const AiVinAnalysis: React.FC<AiVinAnalysisProps> = ({ text }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Clean the text from JSON part if it exists
  const cleanText = text.replace(/\{[\s\S]*\}$/, '').trim();

  return (
    <div className="bg-[var(--tg-theme-secondary-bg-color)] rounded-3xl border border-black/5 overflow-hidden shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-black/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
            <Brain size={18} className="text-blue-500" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xs font-black uppercase tracking-widest">Анализ Qwen 3.5 Expert</span>
            <div className="flex items-center gap-1 text-[9px] opacity-40 font-bold uppercase tracking-tighter">
              <CheckCircle2 size={10} className="text-green-500" />
              <span>VIN верифицирован</span>
            </div>
          </div>
        </div>
        {isOpen ? <ChevronUp size={20} className="opacity-30" /> : <ChevronDown size={20} className="opacity-30" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-black/5">
              <div className="prose prose-sm max-w-none text-[var(--tg-theme-text-color)] opacity-80 markdown-body">
                <Markdown>{cleanText}</Markdown>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
