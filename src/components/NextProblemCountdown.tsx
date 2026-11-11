import React from 'react';
import { ScheduleState, fastForwardSchedule } from '../lib/problemSchedule.ts';
import { Hourglass, FastForward, CheckCircle2 } from 'lucide-react';

interface NextProblemCountdownProps {
  schedule: ScheduleState;
  onScheduleUpdate: (newSchedule: ScheduleState) => void;
  compact?: boolean;
}

export const NextProblemCountdown: React.FC<NextProblemCountdownProps> = ({
  schedule,
  onScheduleUpdate,
  compact = false,
}) => {
  const handleFastForward = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = fastForwardSchedule(5);
    onScheduleUpdate(updated);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 border border-white/10 text-xs font-mono text-white/80">
        <Hourglass className="w-3 h-3 text-emerald-400 shrink-0 animate-pulse" />
        <span className="text-white/50 text-[10px]">Next:</span>
        <span className="tabular-nums font-semibold text-white">{schedule.formattedCountdown}</span>
        <button
          onClick={handleFastForward}
          className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white flex items-center gap-0.5 transition-colors"
          title="Fast-forward schedule by +5 hours to test new problem unlock"
        >
          <FastForward className="w-2.5 h-2.5" />
          <span>+5h</span>
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-neutral-950 border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
          <Hourglass className="w-4 h-4 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold font-mono">
              5-Hour Problem Cadence
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-white/70 font-mono">
              {schedule.intervalsCompleted} Added So Far
            </span>
          </div>
          <p className="text-xs text-white/60 mt-0.5">
            A new mathematical challenge is automatically released every 5 hours.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto font-mono">
        <div className="px-3 py-1.5 rounded-lg bg-black border border-white/15 flex items-center gap-2">
          <span className="text-[11px] text-white/50">Next in:</span>
          <span className="text-sm font-bold tabular-nums text-white">{schedule.formattedCountdown}</span>
        </div>

        <button
          onClick={handleFastForward}
          className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1.5 transition-colors border border-white/10"
          title="Fast-forward 5 hours to immediately unlock the next scheduled problem (testing mode)"
        >
          <FastForward className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] font-sans font-medium">+5h Test</span>
        </button>
      </div>
    </div>
  );
};
