import React from 'react';
import { RankTier } from '../types/math.ts';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import { User, HelpCircle, BarChart3 } from 'lucide-react';

export type NavSection = 'account' | 'how_it_works' | 'performance' | null;

interface TopBarProps {
  activeSection: NavSection;
  onToggleSection: (section: Exclude<NavSection, null>) => void;
  currentRank: RankTier;
  solvedCount: number;
  totalProblems: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeSection,
  onToggleSection,
  currentRank,
  solvedCount,
  totalProblems,
}) => {
  const { user, isAuthReady } = useAuth();
  const { t } = useLanguage();
  const firstName = user?.displayName?.split(' ')[0] || '';

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md transform-gpu border-b border-white/15 px-3 sm:px-6 py-2.5 sm:py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
        {/* Non-interactive Brand Identity & Rank Indicator */}
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <div className="flex items-center gap-2.5 select-none">
            <div className="w-8 h-8 rounded-none bg-neutral-950 border border-white/25 flex items-center justify-center text-white font-bold text-sm tracking-tighter shrink-0">
              <span className="text-white font-mono">MQ</span>
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-white whitespace-nowrap">
              MathQuest
            </span>
          </div>

          <span className="text-[11px] font-mono text-white/65 border border-white/15 bg-neutral-950 px-2 py-0.5 rounded-none tabular-nums whitespace-nowrap">
            R{currentRank.rankNumber} · {currentRank.name}
          </span>
        </div>

        {/* Persistent Navigation Bar: Exactly 3 Items (Always visible on every screen & state) */}
        <nav
          aria-label="Primary navigation"
          className="grid grid-cols-3 sm:flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto"
        >
          {/* 1. Account */}
          <button
            type="button"
            onClick={() => onToggleSection('account')}
            aria-pressed={activeSection === 'account'}
            className={`min-h-[40px] px-2.5 sm:px-3.5 py-1.5 rounded-none text-xs font-medium border transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeSection === 'account'
                ? 'bg-white text-black border-white font-semibold'
                : 'bg-neutral-950/90 text-white/80 hover:text-white border-white/15 hover:border-white/35'
            }`}
          >
            {isAuthReady && user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={firstName || t.nav.account}
                referrerPolicy="no-referrer"
                className="w-4 h-4 rounded-none object-cover shrink-0"
              />
            ) : (
              <User className="w-3.5 h-3.5 shrink-0" />
            )}
            <span className="truncate">{t.nav.account}</span>
          </button>

          {/* 2. How It Works */}
          <button
            type="button"
            onClick={() => onToggleSection('how_it_works')}
            aria-pressed={activeSection === 'how_it_works'}
            className={`min-h-[40px] px-2.5 sm:px-3.5 py-1.5 rounded-none text-xs font-medium border transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeSection === 'how_it_works'
                ? 'bg-white text-black border-white font-semibold'
                : 'bg-neutral-950/90 text-white/80 hover:text-white border-white/15 hover:border-white/35'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{t.nav.howItWorks}</span>
          </button>

          {/* 3. Performance & History */}
          <button
            type="button"
            onClick={() => onToggleSection('performance')}
            aria-pressed={activeSection === 'performance'}
            className={`min-h-[40px] px-2.5 sm:px-3.5 py-1.5 rounded-none text-xs font-medium border transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeSection === 'performance'
                ? 'bg-white text-black border-white font-semibold'
                : 'bg-neutral-950/90 text-white/80 hover:text-white border-white/15 hover:border-white/35'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{t.nav.performanceHistory}</span>
            <span
              className={`hidden md:inline font-mono text-[11px] tabular-nums ${
                activeSection === 'performance' ? 'text-black/70' : 'text-white/50'
              }`}
            >
              {solvedCount}/{totalProblems}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};
