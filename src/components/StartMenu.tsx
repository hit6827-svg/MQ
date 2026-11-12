import React, { useState } from 'react';
import { UserStats } from '../types/math.ts';
import { ScheduleState } from '../lib/problemSchedule.ts';
import { NextProblemCountdown } from './NextProblemCountdown.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import {
  ArrowRight,
  History,
  Award,
  BookOpen,
  LogIn,
  ShieldCheck,
} from 'lucide-react';

interface StartMenuProps {
  onStartPractice: () => void;
  onOpenHistory: () => void;
  onOpenAccount: () => void;
  stats: UserStats;
  schedule: ScheduleState;
  onScheduleUpdate: (newSchedule: ScheduleState) => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({
  onStartPractice,
  onOpenHistory,
  onOpenAccount,
  stats,
  schedule,
  onScheduleUpdate,
}) => {
  const { user, isAuthReady } = useAuth();
  const { t } = useLanguage();
  const [mobileSection, setMobileSection] = useState<'overview' | 'principles'>('overview');

  return (
    <div className="relative z-10 max-w-5xl w-full mx-auto px-3 sm:px-6 py-5 sm:py-8 lg:py-10 space-y-5 sm:space-y-6 lg:space-y-8">
      
      {/* Hero Welcome Section */}
      <div className="text-center space-y-3 sm:space-y-4 max-w-2xl mx-auto">
        <p className="text-xs text-emerald-400/90 font-mono tracking-wide">
          {t.startMenu.badge}
        </p>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight [text-wrap:balance]">
          MathQuest
        </h1>

        <p className="text-sm sm:text-base text-white/70 max-w-xl mx-auto leading-relaxed">
          {t.startMenu.subtitle}
        </p>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-1 sm:pt-2">
          <button
            onClick={() => onStartPractice()}
            className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl bg-white text-black font-bold text-sm hover:bg-neutral-200 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>{t.startMenu.enterWorkspace}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-2 sm:flex gap-2.5 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={onOpenHistory}
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-neutral-950 border border-white/20 text-white font-medium text-xs sm:text-sm hover:bg-neutral-900 transition-all flex items-center justify-center gap-2"
            >
              <History className="w-4 h-4 text-white/80 shrink-0" />
              <span className="truncate">{t.startMenu.practiceHistory}</span>
            </button>

            {isAuthReady && (
              <button
                onClick={onOpenAccount}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-neutral-950 border border-white/20 text-white font-medium text-xs sm:text-sm hover:bg-neutral-900 transition-all flex items-center justify-center gap-2 min-w-0"
              >
                {user ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">{user.displayName || user.email}</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">{t.startMenu.signInToSync}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Small & Medium Device Section Switcher Buttons (Eliminates Vertical Scroll Need) */}
      <div className="lg:hidden grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-neutral-950 border border-white/15 max-w-md mx-auto">
        <button
          onClick={() => setMobileSection('overview')}
          className={`min-h-[40px] px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
            mobileSection === 'overview'
              ? 'bg-white text-black shadow-sm'
              : 'text-white/60 hover:text-white'
          }`}
        >
          {t.startMenu.tabOverview}
        </button>
        <button
          onClick={() => setMobileSection('principles')}
          className={`min-h-[40px] px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
            mobileSection === 'principles'
              ? 'bg-white text-black shadow-sm'
              : 'text-white/60 hover:text-white'
          }`}
        >
          {t.startMenu.tabPrinciples}
        </button>
      </div>

      {/* Overview Section: 5-Hour Cadence Banner + Live Performance Strip */}
      <div className={`${mobileSection === 'overview' ? 'block' : 'hidden lg:block'} space-y-4 sm:space-y-5`}>
        <NextProblemCountdown
          schedule={schedule}
          onScheduleUpdate={onScheduleUpdate}
        />

        {/* Live Performance Overview Strip */}
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950/80 border border-white/15 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 backdrop-blur-md">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-white/40 font-mono block truncate">
              {t.startMenu.succeeded}
            </span>
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">{stats.succeededCount}</span>
              <span className="text-xs text-emerald-400 font-mono tabular-nums">({stats.successPercentage.toFixed(1)}%)</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-white/40 font-mono block truncate">
              {t.startMenu.failedReviewed}
            </span>
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">{stats.failedCount}</span>
              <span className="text-xs text-red-400 font-mono tabular-nums">({stats.failurePercentage.toFixed(1)}%)</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-white/40 font-mono block truncate">
              {t.startMenu.masteryPoints}
            </span>
            <div className="flex items-baseline gap-1.5">
              <Award className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">{stats.totalPoints}</span>
              <span className="text-xs text-white/50">{t.startMenu.pts}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-white/40 font-mono block truncate">
              {t.startMenu.totalTrials}
            </span>
            <div className="flex items-baseline gap-1.5">
              <BookOpen className="w-4 h-4 text-white/60 shrink-0" />
              <span className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">{stats.totalAttempts}</span>
              <span className="text-xs text-white/50">{t.startMenu.sessions}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Practice Principles */}
      <div className={`${mobileSection === 'principles' ? 'block' : 'hidden lg:block'} p-4 sm:p-6 lg:p-7 rounded-2xl bg-neutral-950/60 border border-white/10 space-y-4`}>
        <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-white/50 font-mono">
          {t.startMenu.howItWorks}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 pt-1 text-xs text-white/70">
          <div className="space-y-1.5">
            <span className="text-white font-semibold flex items-center gap-1.5">
              <span className="font-mono text-emerald-400">01.</span> {t.startMenu.p1Title}
            </span>
            <p className="leading-relaxed text-white/60">{t.startMenu.p1Desc}</p>
          </div>

          <div className="space-y-1.5">
            <span className="text-white font-semibold flex items-center gap-1.5">
              <span className="font-mono text-emerald-400">02.</span> {t.startMenu.p2Title}
            </span>
            <p className="leading-relaxed text-white/60">{t.startMenu.p2Desc}</p>
          </div>

          <div className="space-y-1.5">
            <span className="text-white font-semibold flex items-center gap-1.5">
              <span className="font-mono text-emerald-400">03.</span> {t.startMenu.p3Title}
            </span>
            <p className="leading-relaxed text-white/60">{t.startMenu.p3Desc}</p>
          </div>

          <div className="space-y-1.5">
            <span className="text-white font-semibold flex items-center gap-1.5">
              <span className="font-mono text-emerald-400">04.</span> {t.startMenu.p4Title}
            </span>
            <p className="leading-relaxed text-white/60">{t.startMenu.p4Desc}</p>
          </div>
        </div>
      </div>

    </div>
  );
};
