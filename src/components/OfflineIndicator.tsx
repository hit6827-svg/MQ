import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const { t } = useLanguage();
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-none bg-neutral-900/80 border border-white/20 px-3.5 py-2 text-xs font-medium text-white shadow-xl backdrop-blur-xl">
      <WifiOff className="w-3.5 h-3.5 text-white/80 shrink-0" />
      <span>{t.offline.banner}</span>
    </div>
  );
};
