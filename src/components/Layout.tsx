import React, { useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    
    if (tg.expand) tg.expand();
    
    // Set header color based on theme (supported from 6.1)
    if (tg.isVersionAtLeast && tg.isVersionAtLeast('6.1')) {
      tg.setHeaderColor(tg.themeParams.bg_color || '#ffffff');
    }
  }, []);

  return (
    <div className="min-h-screen p-4 flex flex-col gap-6 max-w-md mx-auto">
      {title && (
        <header className="text-center mt-4">
          <h1 className="text-2xl font-bold text-[var(--tg-theme-text-color)]">{title}</h1>
          <p className="text-sm opacity-70">Подбор масел по VIN или модели автомобиля</p>
        </header>
      )}
      <main className="flex-1">
        {children}
      </main>
      <footer className="text-center py-4 text-xs opacity-50">
        MasloMARKET Podbor AI &copy; 2026. Данные RAVENOL.
      </footer>
    </div>
  );
};
