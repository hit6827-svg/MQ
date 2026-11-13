import React from 'react';
import { Exercise, Track, TrackProgress } from '../types/math.ts';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import { Lock, ArrowRight, ArrowLeft, Circle } from 'lucide-react';

interface LockedLevelCardProps {
  exercise: Exercise;
  track: Track;
  trackProgress: TrackProgress;
  onJumpToExercise: (exercise: Exercise) => void;
  onBackToTracks: () => void;
}

export const LockedLevelCard: React.FC<LockedLevelCardProps> = ({
  exercise,
  track,
  trackProgress,
  onJumpToExercise,
  onBackToTracks,
}) => {
  const { t } = useLanguage();
  const nextBasic = trackProgress.missingBasicExercises[0] || trackProgress.basicExercises[0];

  return (
    <div className="p-5 sm:p-8 lg:p-12 rounded-none bg-neutral-950/90 border border-white/15 text-center space-y-6 max-w-2xl mx-auto">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-none bg-black border border-amber-500/35 flex items-center justify-center mx-auto">
        <Lock className="w-7 h-7 text-amber-400" />
      </div>

      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-semibold block">
          {t.locked.badge}
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          {exercise.title}
        </h2>
        <p className="text-xs sm:text-sm text-white/60 leading-relaxed max-w-lg mx-auto">
          {t.locked.subtitle}
        </p>
      </div>

      <div className="p-4 rounded-none bg-black/80 border border-white/15 text-left space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono border-b border-white/10 pb-2.5">
          <span className="text-white/60">
            {t.locked.trackLabel} <strong className="text-white">{track.title}</strong>
          </span>
          <span className="text-amber-400 tabular-nums">
            {t.locked.progressLabel} {trackProgress.basicSolvedCount}/
            {trackProgress.basicTotalCount}
          </span>
        </div>

        <p className="text-xs font-medium text-white/80">{t.locked.checklistTitle}</p>

        <div className="space-y-2">
          {trackProgress.missingBasicExercises.map((req) => (
            <button
              key={req.id}
              type="button"
              onClick={() => onJumpToExercise(req)}
              className="w-full min-h-[42px] px-3 py-2 rounded-none bg-neutral-950 hover:bg-neutral-900 border border-white/15 hover:border-white/35 flex items-center justify-between gap-3 text-left transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Circle className="w-3.5 h-3.5 text-white/40 shrink-0" />
                <span className="text-xs font-medium text-white truncate">{req.title}</span>
              </div>
              <span className="text-[11px] font-mono text-white/55 shrink-0 flex items-center gap-1">
                <span>{t.tracks.openProblem}</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
        {nextBasic && (
          <button
            type="button"
            onClick={() => onJumpToExercise(nextBasic)}
            className="w-full sm:w-auto min-h-[44px] py-2.5 px-5 rounded-none bg-white hover:bg-neutral-200 text-black font-semibold text-xs inline-flex items-center justify-center gap-2 transition-colors"
          >
            <span>{t.locked.jumpToBasic}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={onBackToTracks}
          className="w-full sm:w-auto min-h-[44px] py-2.5 px-5 rounded-none bg-black hover:bg-neutral-900 border border-white/15 text-white/85 font-medium text-xs inline-flex items-center justify-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.locked.backToTracks}</span>
        </button>
      </div>
    </div>
  );
};
