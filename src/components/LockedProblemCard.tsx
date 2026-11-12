import React from 'react';
import { Exercise } from '../types/math.ts';
import { ScheduleState, fastForwardSchedule } from '../lib/problemSchedule.ts';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import { Lock, Hourglass, FastForward, BookOpen } from 'lucide-react';

interface LockedProblemCardProps {
  exercise: Exercise;
  schedule: ScheduleState;
  onScheduleUpdate: (newSchedule: ScheduleState) => void;
  onUnlocked: () => void;
}

export const LockedProblemCard: React.FC<LockedProblemCardProps> = ({
  exercise,
  schedule,
  onScheduleUpdate,
  onUnlocked,
}) => {
  const { t } = useLanguage();

  const handleFastForwardUnlock = () => {
    const hoursNeeded = Math.max(5, (exercise.unlockHourOffset ?? 5) - Math.floor(schedule.elapsedHours));
    const updated = fastForwardSchedule(hoursNeeded);
    onScheduleUpdate(updated);
    onUnlocked();
  };

  return (
    <div className="p-5 sm:p-8 lg:p-12 rounded-2xl bg-neutral-950 border border-white/15 text-center space-y-5 sm:space-y-6 relative overflow-hidden shadow-2xl">
      {/* Background radial accent */}
      <div className="absolute inset-0 bg-radial from-white/[0.04] to-transparent pointer-events-none" />

      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-neutral-900 border border-white/20 mx-auto flex items-center justify-center text-white/80 shadow-inner">
        <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </div>

      <div className="space-y-2 max-w-lg mx-auto">
        <div className="inline-flex flex-wrap items-center justify-center gap-1.5 text-xs font-mono text-emerald-400">
          <Hourglass className="w-3.5 h-3.5" />
          <span>{t.locked.scheduledProblem}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{t.locked.unlocksIn} {schedule.formattedCountdown}</span>
        </div>

        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-tight">
          {exercise.title}
        </h2>

        <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
          {t.locked.description}
        </p>
      </div>

      {exercise.theoremContext && (
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-black border border-white/10 text-xs text-white/70 max-w-md mx-auto text-left">
          <BookOpen className="w-3.5 h-3.5 text-white/40 shrink-0" />
          <span>{t.locked.focusDomain} <strong className="text-white font-medium">{exercise.theoremContext}</strong></span>
        </div>
      )}

      {/* Unlock / Fast-Forward Actions */}
      <div className="pt-4 border-t border-white/10 max-w-md mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={handleFastForwardUnlock}
          className="w-full sm:w-auto min-h-[44px] px-6 py-3 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.99]"
        >
          <FastForward className="w-4 h-4 text-emerald-700" />
          <span>{t.locked.fastForwardBtn}</span>
        </button>
      </div>
      
      <p className="text-[11px] text-white/40 font-mono">
        {t.locked.footerNote}
      </p>
    </div>
  );
};
