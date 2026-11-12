import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import { Download, Share, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const { t } = useLanguage();

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 border border-white/20 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
        title={t.pwa.installTitle}
      >
        <Download className="w-3.5 h-3.5 text-white/90" />
        <span>{t.pwa.installApp}</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/90 hover:text-white bg-neutral-900 border border-white/20 rounded-lg transition-colors whitespace-nowrap shrink-0"
        >
          <Share className="w-3.5 h-3.5" />
          <span>{t.pwa.installShort}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-xl bg-neutral-950 border border-white/20 p-6 shadow-2xl text-white">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-base font-semibold">{t.pwa.iosTitle}</h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-white/60 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-4 text-xs text-white/80 leading-relaxed">
                {t.pwa.iosStep1Prefix}
                <strong className="text-white">{t.pwa.iosShare}</strong>
                {t.pwa.iosStep1Suffix}
                <br />
                {t.pwa.iosStep2Prefix}
                <strong className="text-white">{t.pwa.iosAddHome}</strong>
                {t.pwa.iosStep2Suffix}
                <br />
                {t.pwa.iosStep3}
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-lg bg-white py-2 text-xs font-semibold text-black hover:bg-neutral-200 transition-colors"
              >
                {t.pwa.gotIt}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
