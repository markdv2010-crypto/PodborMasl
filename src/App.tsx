import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { VinInput } from './components/VinInput';
import { ManualSelection } from './components/ManualSelection';
import { ManualEntry } from './components/ManualEntry';
import { CarInfo } from './components/CarInfo';
import { AiVinAnalysis } from './components/AiVinAnalysis';
import { OilResults } from './components/OilResults';
import { FilterResults } from './components/FilterResults';
import { AiSurvey } from './components/AiSurvey';
import { AiRecommendation } from './components/AiRecommendation';
import { RecentSearches } from './components/RecentSearches';
import { getYearFromVin, decodeVinWithAi } from './api/carApi';
import { getAiRecommendation } from './api/geminiApi';
import { CarData, SearchHistoryItem, SurveyData } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Info, RotateCcw, ExternalLink, ChevronLeft, Clipboard, Sparkles, Loader2 } from 'lucide-react';

type Screen = 'home' | 'ravenol-instructions' | 'manual-selection' | 'manual-entry' | 'results';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [carData, setCarData] = useState<CarData | null>(null);
  const [tempVin, setTempVin] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiText, setAiText] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('search_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveToHistory = (car: CarData) => {
    const newItem: SearchHistoryItem = {
      id: Date.now().toString(),
      car,
      timestamp: Date.now()
    };
    const newHistory = [newItem, ...history.filter(h => h.car.vin !== car.vin || !car.vin)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('search_history', JSON.stringify(newHistory));
  };

  const [aiVinText, setAiVinText] = useState<string | null>(null);

  const handleVinSearch = async (vin: string) => {
    setLoading(true);
    setTempVin(vin);
    
    // Try AI decoding first
    const result = await decodeVinWithAi(vin);
    setLoading(false);
    
    if (result && result.make && result.make !== 'Unknown') {
      setCarData(result);
      saveToHistory(result);
      setAiVinText((window as any).lastAiVinText || null);
      setScreen('results');
      setAiText(null);
    } else {
      // Fallback to Ravenol instructions if AI is unsure
      window.Telegram.WebApp.openLink('https://oilguide.ravenol.de/?lang=ru');
      setScreen('ravenol-instructions');
    }
  };

  const handleManualSelectionComplete = (car: CarData) => {
    setCarData(car);
    saveToHistory(car);
    setScreen('results');
    setAiText(null);
  };

  const handleManualEntryComplete = (car: CarData) => {
    setCarData(car);
    saveToHistory(car);
    setScreen('results');
    setAiText(null);
  };

  const handleAiSurveyComplete = async (survey: SurveyData) => {
    if (!carData) return;
    setAiLoading(true);
    const result = await getAiRecommendation(carData, survey);
    setAiText(result.text);
    setAiLoading(false);
    
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const reset = () => {
    setScreen('home');
    setCarData(null);
    setAiText(null);
    setTempVin('');
  };

  return (
    <Layout title="MasloMARKET Podbor AI">
      <AnimatePresence mode="wait">
        {screen === 'home' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="flex flex-col gap-6"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[var(--tg-theme-button-color)] to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <VinInput onSearch={handleVinSearch} loading={loading} />
            </div>
            
            <div className="flex items-center gap-4 px-4">
              <div className="h-px bg-black/5 flex-1" />
              <span className="text-[10px] opacity-30 font-black uppercase tracking-widest">или выберите вручную</span>
              <div className="h-px bg-black/5 flex-1" />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setScreen('manual-selection')}
              className="w-full py-4 rounded-xl bg-[var(--tg-theme-secondary-bg-color)] text-[var(--tg-theme-text-color)] font-bold border border-black/5 shadow-sm transition-all flex items-center justify-center gap-2"
            >
              Каталог марок
            </motion.button>

            <RecentSearches items={history} onSelect={(item) => {
              setCarData(item.car);
              setScreen('results');
              setAiText(null);
            }} />
          </motion.div>
        )}

        {screen === 'ravenol-instructions' && (
          <motion.div 
            key="ravenol"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex flex-col gap-6"
          >
            <div className="bg-[var(--tg-theme-secondary-bg-color)] p-6 rounded-3xl flex flex-col gap-6 border border-[var(--tg-theme-button-color)]/20 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <ExternalLink size={120} />
              </div>
              
              <div className="flex flex-col gap-2 text-center relative">
                <div className="mx-auto w-12 h-12 bg-[var(--tg-theme-button-color)]/10 rounded-full flex items-center justify-center mb-2">
                  <Sparkles className="text-[var(--tg-theme-button-color)]" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight">ИИ запрашивает помощь</h3>
                <p className="text-sm opacity-60">Для этого VIN нужны точные данные из RAVENOL</p>
              </div>

              <div className="bg-[var(--tg-theme-bg-color)] p-5 rounded-2xl border border-black/5 flex flex-col gap-4 relative">
                <p className="text-sm font-bold leading-tight">
                  Скопируйте VIN и вставьте его в поиск на открывшемся сайте:
                </p>
                <motion.div 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigator.clipboard.writeText(tempVin);
                    window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
                  }}
                  className="flex items-center justify-between bg-black/5 p-4 rounded-xl font-mono text-lg tracking-widest cursor-pointer border border-black/5"
                >
                  <span className="text-[var(--tg-theme-button-color)] font-bold">{tempVin}</span>
                  <Clipboard size={18} className="opacity-40" />
                </motion.div>
              </div>

              <div className="flex flex-col gap-3">
                <ManualEntry 
                  initialData={{ 
                    vin: tempVin,
                    year: getYearFromVin(tempVin)
                  }} 
                  onComplete={handleManualEntryComplete} 
                />
              </div>
            </div>

            <button 
              onClick={() => setScreen('home')}
              className="flex items-center justify-center gap-2 text-sm opacity-50 py-2 font-bold"
            >
              <ChevronLeft size={16} /> Назад к поиску
            </button>
          </motion.div>
        )}

        {screen === 'manual-selection' && (
          <motion.div 
            key="manual-selection"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <ManualSelection onComplete={handleManualSelectionComplete} />
            <button 
              onClick={() => setScreen('home')}
              className="w-full mt-6 py-4 text-sm font-bold opacity-40 flex items-center justify-center gap-2"
            >
              <ChevronLeft size={16} /> Вернуться
            </button>
          </motion.div>
        )}

        {screen === 'results' && carData && (
          <motion.div 
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col gap-6"
          >
            <div className="flex justify-between items-center px-1">
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={reset}
                className="text-xs text-[var(--tg-theme-button-color)] flex items-center gap-1.5 font-black uppercase tracking-widest"
              >
                <RotateCcw size={14} /> Новый поиск
              </motion.button>
              
              {carData.vin && (
                <span className="text-[10px] font-mono opacity-30 tracking-tighter">{carData.vin}</span>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <CarInfo car={carData} />
            </motion.div>

            {aiVinText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <AiVinAnalysis text={aiVinText} />
              </motion.div>
            )}
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <OilResults car={carData} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <FilterResults car={carData} />
            </motion.div>

            {!aiText && !aiLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <AiSurvey onComplete={handleAiSurveyComplete} />
              </motion.div>
            )}

            {(aiLoading || aiText) && (
              <AiRecommendation text={aiText || ''} loading={aiLoading} />
            )}
            
            {aiText && (
              <motion.button 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setAiText(null)}
                className="text-[10px] font-bold uppercase tracking-widest opacity-20 text-center py-4"
              >
                Перезапустить ИИ-анализ
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}


