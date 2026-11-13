import React from 'react';
import { RankEvaluation } from '../lib/ranking.ts';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import { Language } from '../i18n/translations.ts';
import {
  X,
  LogOut,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Globe,
  Clock,
  Sliders,
} from 'lucide-react';

interface AccountPanelProps {
  onClose: () => void;
  rankEval: RankEvaluation;
  defaultTimerMinutes: number;
  onChangeDefaultTimer: (minutes: number) => void;
}

const DEFAULT_TIMER_OPTIONS = [0, 5, 10, 15, 25, 45];

export const AccountPanel: React.FC<AccountPanelProps> = ({
  onClose,
  rankEval,
  defaultTimerMinutes,
  onChangeDefaultTimer,
}) => {
  const { user, isSigningIn, authError, clearAuthError, signInWithGoogle, signOutUser } =
    useAuth();
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-10 relative z-10 space-y-6">
      {/* Header Row */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {language === 'fr' ? 'Profil & Préférences' : 'Profile & Preferences'}
          </h1>
          <p className="text-xs sm:text-sm text-white/55 mt-1">
            {user ? t.account.subtitleSignedIn : t.account.subtitleSignedOut}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="min-h-[40px] px-3 py-1.5 rounded-none bg-neutral-950/75 hover:bg-neutral-900 backdrop-blur-md border border-white/15 text-xs font-medium text-white/80 hover:text-white flex items-center gap-1.5 transition-colors shrink-0"
          aria-label={t.nav.closePanel}
        >
          <X className="w-4 h-4" />
          <span className="hidden sm:inline">{t.nav.backToPractice}</span>
        </button>
      </div>

      {authError && (
        <div className="p-3.5 rounded-none bg-red-950/50 backdrop-blur-md border border-red-500/40 flex items-start gap-2.5 text-xs text-red-200">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span className="flex-1 leading-relaxed">{authError}</span>
          <button
            type="button"
            onClick={clearAuthError}
            className="text-red-300 hover:text-white shrink-0"
            aria-label={t.nav.closePanel}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Profile / Authentication Card */}
      <section className="p-4 sm:p-6 rounded-none bg-neutral-950/70 backdrop-blur-xl border border-white/15 space-y-5">
        {user ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-none bg-black/65 backdrop-blur-md border border-white/15">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-none border border-white/20 object-cover shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-none bg-neutral-900 border border-white/20 flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {(user.displayName || user.email || 'M')[0].toUpperCase()}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm sm:text-base font-bold text-white truncate">
                    {user.displayName || t.account.defaultName}
                  </span>
                  <ShieldCheck
                    className="w-4 h-4 text-emerald-400 shrink-0"
                    aria-label={t.account.verifiedAria}
                  />
                </div>
                <div className="text-xs font-mono text-white/55 truncate mt-0.5">
                  {user.email}
                </div>
              </div>

              <button
                type="button"
                onClick={signOutUser}
                className="min-h-[40px] px-4 py-2 rounded-none bg-neutral-900/80 hover:bg-neutral-800 backdrop-blur-md border border-white/15 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.account.signOut}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-none bg-black/65 backdrop-blur-md border border-white/15">
                <span className="text-[11px] font-mono text-white/45 block">
                  {t.account.currentRank}
                </span>
                <span className="text-base sm:text-lg font-bold text-white font-mono">
                  {t.performance.rankPrefix} {rankEval.currentRank.rankNumber} ·{' '}
                  {rankEval.currentRank.name}
                </span>
              </div>
              <div className="p-3.5 rounded-none bg-black/65 backdrop-blur-md border border-white/15">
                <span className="text-[11px] font-mono text-white/45 block">
                  {t.account.proofsSolved}
                </span>
                <span className="text-base sm:text-lg font-bold text-emerald-400 font-mono tabular-nums">
                  {rankEval.solvedCount}/{rankEval.totalProblems}
                </span>
              </div>
            </div>

            <p className="text-xs text-white/60 leading-relaxed">{t.account.syncNote}</p>
          </>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-none bg-black/65 backdrop-blur-md border border-white/15">
                <span className="text-[11px] font-mono text-white/45 block">
                  {t.account.currentRank}
                </span>
                <span className="text-base sm:text-lg font-bold text-white font-mono">
                  {t.performance.rankPrefix} {rankEval.currentRank.rankNumber} ·{' '}
                  {rankEval.currentRank.name}
                </span>
              </div>
              <div className="p-3.5 rounded-none bg-black/65 backdrop-blur-md border border-white/15">
                <span className="text-[11px] font-mono text-white/45 block">
                  {t.account.proofsSolved}
                </span>
                <span className="text-base sm:text-lg font-bold text-emerald-400 font-mono tabular-nums">
                  {rankEval.solvedCount}/{rankEval.totalProblems}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={signInWithGoogle}
              disabled={isSigningIn}
              className="w-full min-h-[46px] py-3 px-4 rounded-none bg-white hover:bg-neutral-200 disabled:opacity-60 text-black font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-colors shadow-lg"
            >
              {isSigningIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.account.signingIn}</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z"
                    />
                  </svg>
                  <span>{t.account.continueWithGoogle}</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-white/50">{t.account.guestNote}</p>
          </div>
        )}
      </section>

      {/* Preferences Card (NO Attempt Logs) */}
      <section className="p-4 sm:p-6 rounded-none bg-neutral-950/70 backdrop-blur-xl border border-white/15 space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
          <Sliders className="w-4 h-4 text-white/75" />
          <h2 className="text-sm sm:text-base font-bold text-white">
            {t.account.preferencesTitle}
          </h2>
        </div>

        {/* Language Preference */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-white">
              <Globe className="w-4 h-4 text-white/60" />
              <span>{t.account.languageLabel}</span>
            </div>
            <p className="text-xs text-white/55">{t.account.languageDesc}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleLanguageSelect('en')}
              className={`min-h-[38px] px-4 py-1.5 rounded-none text-xs font-mono border transition-all ${
                language === 'en'
                  ? 'bg-white text-black border-white font-semibold'
                  : 'bg-black/70 backdrop-blur-md text-white/70 border-white/15 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => handleLanguageSelect('fr')}
              className={`min-h-[38px] px-4 py-1.5 rounded-none text-xs font-mono border transition-all ${
                language === 'fr'
                  ? 'bg-white text-black border-white font-semibold'
                  : 'bg-black/70 backdrop-blur-md text-white/70 border-white/15 hover:text-white'
              }`}
            >
              Français
            </button>
          </div>
        </div>

        {/* Default Per-Problem Timer Preference */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-white">
              <Clock className="w-4 h-4 text-white/60" />
              <span>{t.account.defaultTimerLabel}</span>
            </div>
            <p className="text-xs text-white/55">{t.account.defaultTimerDesc}</p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            {DEFAULT_TIMER_OPTIONS.map((mins) => {
              const isSelected = defaultTimerMinutes === mins;
              return (
                <button
                  key={mins}
                  type="button"
                  onClick={() => onChangeDefaultTimer(mins)}
                  className={`min-h-[36px] px-3 py-1 rounded-none text-xs font-mono border transition-all ${
                    isSelected
                      ? 'bg-white text-black border-white font-semibold'
                      : 'bg-black/70 backdrop-blur-md text-white/70 border-white/15 hover:text-white'
                  }`}
                >
                  {mins === 0 ? t.account.untimedOption : `${mins} ${t.timer.minUnit}`}
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};
