import React from 'react';
import { TopicSlug } from '../types/math.ts';
import { PWAInstallButton } from './PWAInstallButton.tsx';
import { NextProblemCountdown } from './NextProblemCountdown.tsx';
import { ScheduleState } from '../lib/problemSchedule.ts';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import { History, Compass, LogIn, Globe } from 'lucide-react';

interface TopBarProps {
  activeTopic: TopicSlug;
  onSelectTopic: (topic: TopicSlug) => void;
  onOpenHistory: () => void;
  onOpenStartMenu: () => void;
  onOpenAccount: () => void;
  isStartMenu: boolean;
  totalAttempts: number;
  schedule: ScheduleState;
  onScheduleUpdate: (newSchedule: ScheduleState) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTopic,
  onSelectTopic,
  onOpenHistory,
  onOpenStartMenu,
  onOpenAccount,
  isStartMenu,
  totalAttempts,
  schedule,
  onScheduleUpdate,
}) => {
  const { user, isAuthReady } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const firstName = user?.displayName?.split(' ')[0] || 'Account';

  const topics: { slug: TopicSlug; label: string }[] = [
    { slug: 'calculus', label: t.topBar.topics.calculus },
    { slug: 'linear_algebra', label: t.topBar.topics.linear_algebra },
    { slug: 'number_theory', label: t.topBar.topics.number_theory },
    { slug: 'discrete_math', label: t.topBar.topics.discrete_math },
  ];

  return (
    <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/10 px-3 sm:px-6 py-2.5 sm:py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">
        
        {/* Zone 1: Brand Wordmark (Clickable to return to Start Menu) */}
        <button
          onClick={onOpenStartMenu}
          className="flex items-center gap-2 sm:gap-3 shrink-0 text-left hover:opacity-90 transition-opacity group min-h-[40px]"
          title={t.topBar.returnToMenuTitle}
        >
          <div className="w-8 h-8 rounded-lg bg-neutral-950 border border-white/20 flex items-center justify-center text-white font-bold text-sm tracking-tighter group-hover:border-white/40 transition-colors shrink-0">
            <span className="text-white font-mono">MQ</span>
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-white whitespace-nowrap">
            MathQuest
          </span>
        </button>

        {/* Zone 2: Desktop Navigation Links (lg+ so medium tablets never cramp) */}
        <nav className="hidden lg:flex items-center gap-1 p-1 bg-neutral-950/80 border border-white/10 rounded-xl">
          <button
            onClick={onOpenStartMenu}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
              isStartMenu
                ? 'bg-white text-black shadow-sm font-semibold'
                : 'text-white/60 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{t.topBar.startMenu}</span>
          </button>

          <span className="w-[1px] h-4 bg-white/10 mx-1" aria-hidden="true" />

          {topics.map((tItem) => {
            const isActive = !isStartMenu && activeTopic === tItem.slug;
            return (
              <button
                key={tItem.slug}
                onClick={() => onSelectTopic(tItem.slug)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-white text-black shadow-sm font-semibold'
                    : 'text-white/60 hover:text-white hover:bg-neutral-900'
                }`}
              >
                {tItem.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Cadence Countdown + Language Toggle + PWA Install + History + Account) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="hidden xl:block">
            <NextProblemCountdown
              schedule={schedule}
              onScheduleUpdate={onScheduleUpdate}
              compact={true}
            />
          </div>

          <button
            onClick={toggleLanguage}
            className="flex items-center justify-center gap-1.5 min-h-[40px] px-2.5 sm:px-3 py-1.5 text-xs font-mono font-semibold text-white bg-neutral-950 hover:bg-neutral-900 border border-white/15 hover:border-white/30 rounded-lg transition-all whitespace-nowrap shrink-0"
            title={language === 'en' ? 'Passer en français' : 'Switch to English'}
            aria-label="Toggle language"
          >
            <Globe className="w-3.5 h-3.5 text-white/75" />
            <span>{language.toUpperCase()}</span>
          </button>

          <PWAInstallButton />
          
          <button
            onClick={onOpenHistory}
            className="flex items-center justify-center gap-1.5 sm:gap-2 min-h-[40px] px-2.5 sm:px-3 py-1.5 text-xs font-medium text-white bg-neutral-950 hover:bg-neutral-900 border border-white/15 hover:border-white/30 rounded-lg transition-all whitespace-nowrap shrink-0 group"
            title={t.topBar.historyTitle}
          >
            <History className="w-3.5 h-3.5 text-white/80 group-hover:text-white transition-colors" />
            <span className="hidden sm:inline">{t.topBar.history}</span>
            {totalAttempts > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-neutral-800 text-[10px] font-mono text-white/70 tabular-nums">
                {totalAttempts}
              </span>
            )}
          </button>

          {isAuthReady && (
            <button
              onClick={onOpenAccount}
              className={`flex items-center justify-center gap-2 min-h-[40px] px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 border ${
                user
                  ? 'bg-neutral-950 hover:bg-neutral-900 text-white border-white/20 hover:border-white/40'
                  : 'bg-white hover:bg-neutral-200 text-black font-semibold border-white'
              }`}
              title={user ? `${t.topBar.signedInTitle} ${user.email || user.displayName}` : t.topBar.signInTitle}
            >
              {user ? (
                <>
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={firstName}
                      referrerPolicy="no-referrer"
                      className="w-4 h-4 rounded object-cover"
                    />
                  ) : (
                    <span className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center text-[10px] font-mono font-bold">
                      {firstName[0]?.toUpperCase() || 'U'}
                    </span>
                  )}
                  <span className="max-w-[80px] sm:max-w-[96px] truncate hidden sm:inline">{firstName}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline sm:inline">{t.topBar.signIn}</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>

      {/* Small & Medium Sub-Nav: Non-scrolling responsive button grid */}
      <nav
        aria-label="Topic navigation"
        className="lg:hidden grid grid-cols-2 sm:grid-cols-5 gap-1.5 pt-2.5"
      >
        <button
          onClick={onOpenStartMenu}
          className={`col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 min-h-[38px] px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap truncate ${
            isStartMenu
              ? 'bg-white text-black font-semibold'
              : 'text-white/70 hover:text-white bg-neutral-950 border border-white/10'
          }`}
        >
          <Compass className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{t.topBar.menuShort}</span>
        </button>

        {topics.map((tItem) => {
          const isActive = !isStartMenu && activeTopic === tItem.slug;
          return (
            <button
              key={tItem.slug}
              onClick={() => onSelectTopic(tItem.slug)}
              className={`flex items-center justify-center min-h-[38px] px-2 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap truncate ${
                isActive
                  ? 'bg-white text-black font-semibold'
                  : 'text-white/70 hover:text-white bg-neutral-950 border border-white/10'
              }`}
              title={tItem.label}
            >
              <span className="truncate">{tItem.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
