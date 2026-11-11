import React from 'react';
import { UserStats } from '../types/math.ts';
import { ScheduleState } from '../lib/problemSchedule.ts';
import { NextProblemCountdown } from './NextProblemCountdown.tsx';
import {
  ArrowRight,
  History,
  Award,
  BookOpen,
} from 'lucide-react';

interface StartMenuProps {
  onStartPractice: () => void;
  onOpenHistory: () => void;
  stats: UserStats;
  schedule: ScheduleState;
  onScheduleUpdate: (newSchedule: ScheduleState) => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({
  onStartPractice,
  onOpenHistory,
  stats,
  schedule,
  onScheduleUpdate,
}) => {
  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-10">
      
      {/* Hero Welcome Section */}
      <div className="text-center space-y-5 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-950 border border-white/15 text-xs text-white/80 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Pure Mathematics Problem-Solving Engine</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
          MathQuest
        </h1>

        <p className="text-base sm:text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
          Master higher mathematics through authentic problem solving. Tackle curated, immutable problems, self-evaluate with precision, and uncover exhaustive step-by-step derivations.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onStartPractice()}
            className="px-7 py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-neutral-200 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
          >
            <span>Enter Problem Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenHistory}
            className="px-5 py-3 rounded-xl bg-neutral-950 border border-white/20 text-white font-medium text-sm hover:bg-neutral-900 transition-all flex items-center gap-2"
          >
            <History className="w-4 h-4 text-white/80" />
            <span>Practice History & Stats</span>
          </button>
        </div>
      </div>

      {/* 5-Hour Periodic Problem Cadence Banner */}
      <NextProblemCountdown
        schedule={schedule}
        onScheduleUpdate={onScheduleUpdate}
      />

      {/* Live Performance Overview Strip */}
      <div className="p-5 rounded-2xl bg-neutral-950/80 border border-white/15 grid grid-cols-2 md:grid-cols-4 gap-4 backdrop-blur-md">
        <div className="space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-white/40 font-mono">Succeeded</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">{stats.succeededCount}</span>
            <span className="text-xs text-emerald-400 font-mono tabular-nums">({stats.successPercentage.toFixed(1)}%)</span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-white/40 font-mono">Failed / Reviewed</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">{stats.failedCount}</span>
            <span className="text-xs text-red-400 font-mono tabular-nums">({stats.failurePercentage.toFixed(1)}%)</span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-white/40 font-mono">Mastery Points</span>
          <div className="flex items-baseline gap-1.5">
            <Award className="w-4 h-4 text-emerald-400" />
            <span className="text-2xl font-bold font-mono text-white tabular-nums">{stats.totalPoints}</span>
            <span className="text-xs text-white/50">pts</span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-white/40 font-mono">Total Trials</span>
          <div className="flex items-baseline gap-1.5">
            <BookOpen className="w-4 h-4 text-white/60" />
            <span className="text-2xl font-bold font-mono text-white tabular-nums">{stats.totalAttempts}</span>
            <span className="text-xs text-white/50">sessions</span>
          </div>
        </div>
      </div>

      {/* Practice Principles */}
      <div className="p-6 md:p-8 rounded-2xl bg-neutral-950/60 border border-white/10 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50 font-mono">
          How MathQuest Works
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2 text-xs text-white/70">
          <div className="space-y-1.5">
            <span className="text-white font-semibold flex items-center gap-1.5">
              <span className="font-mono text-emerald-400">01.</span> Curated & Immutable
            </span>
            <p className="leading-relaxed text-white/60">
              Problems are mathematically rigorous and read-only. No automated parser rejections or form glitches.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-white font-semibold flex items-center gap-1.5">
              <span className="font-mono text-emerald-400">02.</span> Self-Evaluation Gate
            </span>
            <p className="leading-relaxed text-white/60">
              Solve on paper. Compare with benchmark: press Green to claim points, or Red if you struggled.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-white font-semibold flex items-center gap-1.5">
              <span className="font-mono text-emerald-400">03.</span> Stepwise Derivation
            </span>
            <p className="leading-relaxed text-white/60">
              Marking Red immediately unfolds the exhaustive sequence of solving so you learn key transformation rules.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-white font-semibold flex items-center gap-1.5">
              <span className="font-mono text-emerald-400">04.</span> 5-Hour Cadence
            </span>
            <p className="leading-relaxed text-white/60">
              A new problem unlocks every 5 hours, cultivating steady spaced repetition and deep mathematical intuition.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
