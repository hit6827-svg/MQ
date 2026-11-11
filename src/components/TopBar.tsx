import React from 'react';
import { TopicSlug } from '../types/math.ts';
import { PWAInstallButton } from './PWAInstallButton.tsx';
import { NextProblemCountdown } from './NextProblemCountdown.tsx';
import { ScheduleState } from '../lib/problemSchedule.ts';
import { History, LayoutGrid, Compass } from 'lucide-react';

interface TopBarProps {
  activeTopic: TopicSlug;
  onSelectTopic: (topic: TopicSlug) => void;
  onOpenHistory: () => void;
  onOpenStartMenu: () => void;
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
  isStartMenu,
  totalAttempts,
  schedule,
  onScheduleUpdate,
}) => {
  const topics: { slug: TopicSlug; label: string }[] = [
    { slug: 'calculus', label: 'Calculus' },
    { slug: 'linear_algebra', label: 'Linear Algebra' },
    { slug: 'number_theory', label: 'Number Theory' },
    { slug: 'discrete_math', label: 'Discrete Math' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-black/85 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Brand Wordmark (Clickable to return to Start Menu) */}
        <button
          onClick={onOpenStartMenu}
          className="flex items-center gap-3 shrink-0 text-left hover:opacity-90 transition-opacity group"
          title="Return to MathQuest Start Menu"
        >
          <div className="w-8 h-8 rounded-lg bg-neutral-950 border border-white/20 flex items-center justify-center text-white font-bold text-sm tracking-tighter group-hover:border-white/40 transition-colors">
            <span className="text-white font-mono">MQ</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap">
            MathQuest
          </span>
        </button>

        {/* Zone 2: Navigation Links (Start Menu vs Topics) */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-neutral-950/80 border border-white/10 rounded-xl">
          <button
            onClick={onOpenStartMenu}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
              isStartMenu
                ? 'bg-white text-black shadow-sm font-semibold'
                : 'text-white/60 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Start Menu</span>
          </button>

          <span className="w-[1px] h-4 bg-white/10 mx-1" aria-hidden="true" />

          {topics.map((t) => {
            const isActive = !isStartMenu && activeTopic === t.slug;
            return (
              <button
                key={t.slug}
                onClick={() => onSelectTopic(t.slug)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-white text-black shadow-sm font-semibold'
                    : 'text-white/60 hover:text-white hover:bg-neutral-900'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Cadence Countdown + PWA Install + History) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden lg:block">
            <NextProblemCountdown
              schedule={schedule}
              onScheduleUpdate={onScheduleUpdate}
              compact={true}
            />
          </div>

          <PWAInstallButton />
          
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-white bg-neutral-950 hover:bg-neutral-900 border border-white/15 hover:border-white/30 rounded-lg transition-all whitespace-nowrap shrink-0 group"
            title="View practice performance and detailed history logs"
          >
            <History className="w-3.5 h-3.5 text-white/80 group-hover:text-white transition-colors" />
            <span>History</span>
            {totalAttempts > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-neutral-800 text-[10px] font-mono text-white/70 tabular-nums">
                {totalAttempts}
              </span>
            )}
          </button>
        </div>

      </div>

      {/* Mobile Sub-Nav */}
      <div className="md:hidden flex items-center gap-1.5 overflow-x-auto pt-2.5 pb-0.5 no-scrollbar">
        <button
          onClick={onOpenStartMenu}
          className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 ${
            isStartMenu
              ? 'bg-white text-black font-semibold'
              : 'text-white/60 bg-neutral-950 border border-white/10'
          }`}
        >
          Menu
        </button>

        {topics.map((t) => {
          const isActive = !isStartMenu && activeTopic === t.slug;
          return (
            <button
              key={t.slug}
              onClick={() => onSelectTopic(t.slug)}
              className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-white text-black font-semibold'
                  : 'text-white/60 bg-neutral-950 border border-white/10'
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
