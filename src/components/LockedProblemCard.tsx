import React from 'react';
import { Exercise } from '../types/math.ts';
import { ScheduleState, fastForwardSchedule } from '../lib/problemSchedule.ts';
import { Lock, Hourglass, FastForward, Sparkles, BookOpen } from 'lucide-react';

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
  const handleFastForwardUnlock = () => {
    const hoursNeeded = Math.max(5, (exercise.unlockHourOffset ?? 5) - Math.floor(schedule.elapsedHours));
    const updated = fastForwardSchedule(hoursNeeded);
    onScheduleUpdate(updated);
    onUnlocked();
  };

  return (
    <div className="p-8 md:p-12 rounded-2xl bg-neutral-950 border border-white/15 text-center space-y-6 relative overflow-hidden shadow-2xl">
      {/* Background radial accent */}
      <div className="absolute inset-0 bg-radial from-white/[0.04] to-transparent pointer-events-none" />

      <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/20 mx-auto flex items-center justify-center text-white/80 shadow-inner">
        <Lock className="w-6 h-6 text-white" />
      </div>

      <div className="space-y-2 max-w-lg mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-white/10 text-xs font-mono text-emerald-400">
          <Hourglass className="w-3.5 h-3.5 animate-pulse" />
          <span>Scheduled Problem</span>
          <span aria-hidden="true">·</span>
          <span>Unlocks in {schedule.formattedCountdown}</span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          {exercise.title}
        </h2>

        <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
          MathQuest releases an immutable, rigorous problem every 5 hours. This exercise is scheduled for your next deliberate practice session.
        </p>
      </div>

      {exercise.theoremContext && (
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-black border border-white/10 text-xs text-white/70 max-w-md mx-auto">
          <BookOpen className="w-3.5 h-3.5 text-white/40 shrink-0" />
          <span>Focus Domain: <strong className="text-white font-medium">{exercise.theoremContext}</strong></span>
        </div>
      )}

      {/* Unlock / Fast-Forward Actions */}
      <div className="pt-4 border-t border-white/10 max-w-md mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={handleFastForwardUnlock}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] active:scale-[0.99]"
        >
          <FastForward className="w-4 h-4 text-emerald-700" />
          <span>Fast-Forward +5h (Test Unlock Now)</span>
        </button>
      </div>
      
      <p className="text-[11px] text-white/40 font-mono">
        Interval timer advances automatically in real time.
      </p>
    </div>
  );
};
