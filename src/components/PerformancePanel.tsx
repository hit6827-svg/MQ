import React from 'react';
import {
  Exercise,
  Track,
  TrackProgress,
  TrackSlug,
  UserStats,
} from '../types/math.ts';
import { RankEvaluation } from '../lib/ranking.ts';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import {
  X,
  Award,
  CheckCircle2,
  Circle,
  Lock,
  ArrowRight,
  Cloud,
} from 'lucide-react';

interface PerformancePanelProps {
  onClose: () => void;
  stats: UserStats;
  rankEval: RankEvaluation;
  tracks: Track[];
  progressByTrack: Record<TrackSlug, TrackProgress>;
  solvedSet: Set<string>;
  onOpenExercise: (exercise: Exercise) => void;
}

export const PerformancePanel: React.FC<PerformancePanelProps> = ({
  onClose,
  stats,
  rankEval,
  tracks,
  progressByTrack,
  solvedSet,
  onOpenExercise,
}) => {
  const { user } = useAuth();
  const { language, t } = useLanguage();

  return (
    <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-10 relative z-10 space-y-6">
      {/* Header Row */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {language === 'fr'
              ? 'Progression de rang & Maîtrise'
              : 'Rank Standing & Track Mastery'}
          </h1>
          <p className="text-xs sm:text-sm text-white/55 mt-1">{t.performance.subtitle}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="min-h-[40px] px-3 py-1.5 rounded-none bg-neutral-950 hover:bg-neutral-900 border border-white/15 text-xs font-medium text-white/80 hover:text-white flex items-center gap-1.5 transition-colors shrink-0"
          aria-label={t.nav.closePanel}
        >
          <X className="w-4 h-4" />
          <span className="hidden sm:inline">{t.nav.backToPractice}</span>
        </button>
      </div>

      {/* Sync Indicator (Non-button informational banner) */}
      <div className="px-4 py-2.5 rounded-none bg-neutral-950/90 border border-white/15 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-white/75">
          <Cloud className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {user
              ? `${t.performance.syncActive} (${user.email || user.displayName})`
              : t.performance.localModeNote}
          </span>
        </div>
        <span className="font-mono text-white/55 tabular-nums">
          {rankEval.solvedCount}/{rankEval.totalProblems}
        </span>
      </div>

      {/* Current Rank Card + Next Promotion Checklist */}
      <section className="p-4 sm:p-6 rounded-none bg-neutral-950/90 border border-white/15 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-none bg-black border border-white/20 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-white/50 block">
                {t.performance.currentRankLabel}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {t.performance.rankPrefix} {rankEval.currentRank.rankNumber} —{' '}
                {rankEval.currentRank.name}
              </h2>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-mono text-white/60 block">
              {rankEval.solvedCount}/{rankEval.totalProblems} {t.tracks.solved}
            </span>
            <span className="text-sm font-mono font-bold text-emerald-400 tabular-nums">
              {rankEval.overallProgressPercent.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="w-full h-2.5 rounded-none bg-black/70 border border-white/15 overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${Math.min(100, rankEval.overallProgressPercent)}%` }}
          />
        </div>

        {/* Next Promotion Requirements */}
        {rankEval.nextRank ? (
          <div className="p-3.5 rounded-none bg-black/80 border border-white/15 space-y-2">
            <div className="text-xs font-semibold text-white">
              {t.performance.nextPromotion}{' '}
              <span className="text-emerald-400 font-mono">
                {t.performance.rankPrefix} {rankEval.nextRank.rankNumber} —{' '}
                {rankEval.nextRank.name}
              </span>
            </div>
            <ul className="space-y-1.5">
              {rankEval.nextRankChecklist.map((req) => (
                <li key={req.label} className="flex items-center gap-2 text-xs">
                  {req.met ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-white/35 shrink-0" />
                  )}
                  <span className={req.met ? 'text-white' : 'text-white/65'}>
                    {req.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="p-3.5 rounded-none bg-emerald-950/50 border border-emerald-500/35 text-xs font-semibold text-emerald-300">
            {t.performance.highestRankReached}
          </div>
        )}
      </section>

      {/* Aggregate Proof Mastery Metrics (NO attempt logs, NO points) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-none bg-neutral-950/90 border border-white/15">
          <span className="text-[11px] font-mono text-white/50 block">
            {t.performance.proofsSolved}
          </span>
          <span className="text-2xl font-bold font-mono text-white tabular-nums mt-1 block">
            {stats.solvedCount}/{stats.totalProblems}
          </span>
        </div>

        <div className="p-4 rounded-none bg-neutral-950/90 border border-white/15">
          <span className="text-[11px] font-mono text-white/50 block">
            {t.performance.verifiedSessions}
          </span>
          <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums mt-1 block">
            {stats.verifiedCount}
          </span>
        </div>

        <div className="p-4 rounded-none bg-neutral-950/90 border border-white/15">
          <span className="text-[11px] font-mono text-white/50 block">
            {t.performance.reviewedSessions}
          </span>
          <span className="text-2xl font-bold font-mono text-red-400 tabular-nums mt-1 block">
            {stats.struggledCount}
          </span>
        </div>

        <div className="p-4 rounded-none bg-neutral-950/90 border border-white/15">
          <span className="text-[11px] font-mono text-white/50 block">
            {t.performance.verificationRate}
          </span>
          <span className="text-2xl font-bold font-mono text-white tabular-nums mt-1 block">
            {stats.accuracyPercentage.toFixed(0)}%
          </span>
        </div>
      </section>

      {/* Track & Level Completion Breakdown (NO attempt logs or timestamps) */}
      <section className="space-y-4">
        <h2 className="text-sm sm:text-base font-bold text-white">
          {t.performance.tracksBreakdown}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {tracks.map((track) => {
            const prog = progressByTrack[track.slug];
            return (
              <div
                key={track.id}
                className="p-4 sm:p-5 rounded-none bg-neutral-950/90 border border-white/15 space-y-4"
              >
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/10">
                  <h3 className="text-sm sm:text-base font-bold text-white">{track.title}</h3>
                  <span className="text-xs font-mono text-white/60 tabular-nums">
                    {prog.basicSolvedCount + prog.advancedSolvedCount}/
                    {prog.basicTotalCount + prog.advancedTotalCount}
                  </span>
                </div>

                {/* Basic Exercises Status */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-white/60">
                    <span>{t.tracks.basicLevel}</span>
                    <span>
                      {prog.basicSolvedCount}/{prog.basicTotalCount}
                    </span>
                  </div>
                  {prog.basicExercises.map((ex) => {
                    const solved = solvedSet.has(ex.id);
                    return (
                      <div
                        key={ex.id}
                        className="px-3 py-2 rounded-none bg-black/80 border border-white/15 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {solved ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-white/35 shrink-0" />
                          )}
                          <span className="text-xs text-white/90 truncate">{ex.title}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onOpenExercise(ex)}
                          className="text-[11px] font-mono text-white/65 hover:text-white flex items-center gap-1 shrink-0"
                        >
                          <span>{t.performance.openInPractice}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Advanced Exercises Status */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-white/60">
                    <span>{t.tracks.advancedLevel}</span>
                    <span className={prog.isAdvancedUnlocked ? 'text-emerald-400' : 'text-amber-400'}>
                      {prog.isAdvancedUnlocked
                        ? `${prog.advancedSolvedCount}/${prog.advancedTotalCount}`
                        : t.performance.lockedBadge}
                    </span>
                  </div>
                  {prog.advancedExercises.map((ex) => {
                    const solved = solvedSet.has(ex.id);
                    return (
                      <div
                        key={ex.id}
                        className="px-3 py-2 rounded-none bg-black/70 border border-white/10 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {!prog.isAdvancedUnlocked ? (
                            <Lock className="w-3.5 h-3.5 text-amber-400/75 shrink-0" />
                          ) : solved ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-white/35 shrink-0" />
                          )}
                          <span
                            className={`text-xs truncate ${
                              prog.isAdvancedUnlocked ? 'text-white/90' : 'text-white/50'
                            }`}
                          >
                            {ex.title}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onOpenExercise(ex)}
                          className="text-[11px] font-mono text-white/65 hover:text-white flex items-center gap-1 shrink-0"
                        >
                          <span>{t.performance.openInPractice}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Full Rank Ladder Summary */}
      <section className="p-4 sm:p-5 rounded-none bg-neutral-950/90 border border-white/15 space-y-3">
        <h2 className="text-sm sm:text-base font-bold text-white pb-2 border-b border-white/10">
          {t.performance.ladderSection}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {rankEval.ladder.map((tier) => {
            const isCurrent = tier.rankNumber === rankEval.currentRank.rankNumber;
            const isReached = tier.rankNumber >= rankEval.currentRank.rankNumber;
            return (
              <div
                key={tier.id}
                className={`p-3 rounded-none border space-y-1 ${
                  isCurrent
                    ? 'bg-white text-black border-white'
                    : isReached
                    ? 'bg-black/80 border-emerald-500/35 text-white'
                    : 'bg-black/65 border-white/10 text-white/55'
                }`}
              >
                <div className="text-[11px] font-mono font-bold">
                  {t.performance.rankPrefix} {tier.rankNumber}
                </div>
                <div className="text-sm font-bold">{tier.name}</div>
                <div
                  className={`text-[10px] leading-snug ${
                    isCurrent ? 'text-black/75' : 'text-white/50'
                  }`}
                >
                  {tier.shortRequirement}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};
