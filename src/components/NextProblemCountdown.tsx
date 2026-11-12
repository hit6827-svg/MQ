import React from 'react';
import { ScheduleState, fastForwardSchedule } from '../lib/problemSchedule.ts';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import { Hourglass, FastForward } from 'lucide-react';

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
  const { t } = useLanguage();

  const handleFastForward = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = fastForwardSchedule(5);
    onScheduleUpdate(updated);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 min-h-[38px] rounded-lg bg-neutral-900 border border-white/10 text-xs font-mono text-white/80 shrink-0">
        <Hourglass className="w-3 h-3 text-emerald-400 shrink-0" />
        <span className="text-white/50 text-[10px]">{t.countdown.nextCompact}</span>
        <span className="tabular-nums font-semibold text-white">{schedule.formattedCountdown}</span>
        <button
          onClick={handleFastForward}
          className="ml-1 min-h-[28px] text-[10px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white flex items-center gap-0.5 transition-colors"
          title={t.countdown.fastForwardTooltip}
        >
          <FastForward className="w-2.5 h-2.5" />
          <span>+5h</span>
        </button>
      </div>
    );
  }

  return (
    <div className="p-3.5 sm:p-4 rounded-xl bg-neutral-950 border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-start sm:items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
          <Hourglass className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold font-mono">
              {t.countdown.cadenceTitle}
            </span>
            <span className="text-[10px] text-white/60 font-mono tabular-nums">
              · {schedule.intervalsCompleted} {t.countdown.addedSoFar}
            </span>
          </div>
          <p className="text-xs text-white/60 mt-0.5 leading-relaxed">
            {t.countdown.cadenceDesc}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end font-mono shrink-0">
        <div className="min-h-[40px] px-3 py-1.5 rounded-lg bg-black border border-white/15 flex items-center gap-2">
          <span className="text-[11px] text-white/50">{t.countdown.nextIn}</span>
          <span className="text-sm font-bold tabular-nums text-white">{schedule.formattedCountdown}</span>
        </div>

        <button
          onClick={handleFastForward}
          className="min-h-[40px] px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1.5 transition-colors border border-white/10 whitespace-nowrap"
          title={t.countdown.testFastForwardTooltip}
        >
          <FastForward className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-sans font-medium">{t.countdown.testButton}</span>
        </button>
      </div>
    </div>
  );
};
