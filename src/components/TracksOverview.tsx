import React from 'react';
import { Track, TrackProgress, TrackSlug, Exercise } from '../types/math.ts';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import {
  CheckCircle2,
  Lock,
  Unlock,
  ArrowRight,
  Sigma,
  Shapes,
  Circle,
} from 'lucide-react';

interface TracksOverviewProps {
  tracks: Track[];
  progressByTrack: Record<TrackSlug, TrackProgress>;
  solvedSet: Set<string>;
  onSelectExercise: (exercise: Exercise) => void;
}

export const TracksOverview: React.FC<TracksOverviewProps> = ({
  tracks,
  progressByTrack,
  solvedSet,
  onSelectExercise,
}) => {
  const { t } = useLanguage();

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-10 relative z-10 space-y-6 sm:space-y-8">
      {/* Curriculum Intro */}
      <section className="max-w-3xl space-y-2.5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-neutral-950 border border-white/15 text-[11px] font-mono text-white/75 tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-none bg-emerald-400" />
          <span>{t.tracks.badge}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
          {t.tracks.title}
        </h1>
        <p className="text-xs sm:text-sm text-white/65 leading-relaxed">
          {t.tracks.subtitle}
        </p>
      </section>

      {/* Two Structured Proof Tracks */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {tracks.map((track) => {
          const prog = progressByTrack[track.slug];
          const Icon = track.slug === 'numbers_structures' ? Shapes : Sigma;
          const nextBasic =
            prog.missingBasicExercises[0] || prog.basicExercises[0];
          const nextAdvanced =
            prog.advancedExercises.find((e) => !solvedSet.has(e.id)) ||
            prog.advancedExercises[0];

          return (
            <div
              key={track.id}
              className="rounded-none bg-neutral-950/90 border border-white/15 p-4 sm:p-6 flex flex-col justify-between gap-5"
            >
              {/* Track Header */}
              <div className="space-y-2.5 pb-4 border-b border-white/10">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-none bg-black border border-white/20 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">
                        {track.title}
                      </h2>
                      <p className="text-[11px] font-mono text-white/50 mt-0.5">
                        {track.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-white/65 leading-relaxed">
                  {track.description}
                </p>
              </div>

              {/* Level 1: Basic */}
              <div className="p-3.5 sm:p-4 rounded-none bg-black/80 border border-white/15 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono uppercase tracking-wider font-bold text-white">
                        {t.tracks.basicLevel}
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400">
                        · {t.tracks.unlocked}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/50 mt-0.5">
                      {t.tracks.basicDesc}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-white/75 tabular-nums shrink-0">
                    {prog.basicSolvedCount}/{prog.basicTotalCount} {t.tracks.solved}
                  </span>
                </div>

                <div className="space-y-2">
                  {prog.basicExercises.map((ex, idx) => {
                    const isSolved = solvedSet.has(ex.id);
                    return (
                      <button
                        key={ex.id}
                        type="button"
                        onClick={() => onSelectExercise(ex)}
                        className="w-full min-h-[44px] px-3 py-2.5 rounded-none bg-neutral-950 hover:bg-neutral-900 border border-white/15 hover:border-white/35 text-left flex items-center justify-between gap-3 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {isSolved ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-white/35 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-white truncate">
                              {idx + 1}. {ex.title}
                            </div>
                            <div className="text-[10px] font-mono text-white/45 truncate">
                              {ex.topicTag}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-white/45 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Level 2: Advanced (Locked until Basic completed) */}
              <div
                className={`p-3.5 sm:p-4 rounded-none border space-y-3 transition-colors ${
                  prog.isAdvancedUnlocked
                    ? 'bg-black/80 border-white/20'
                    : 'bg-neutral-950/70 border-white/15 border-dashed'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      {prog.isAdvancedUnlocked ? (
                        <Unlock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      )}
                      <span className="text-xs font-mono uppercase tracking-wider font-bold text-white">
                        {t.tracks.advancedLevel}
                      </span>
                      <span
                        className={`text-[11px] font-mono ${
                          prog.isAdvancedUnlocked ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        · {prog.isAdvancedUnlocked ? t.tracks.unlocked : t.tracks.locked}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/50 mt-0.5">
                      {t.tracks.advancedDesc}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-white/75 tabular-nums shrink-0">
                    {prog.advancedSolvedCount}/{prog.advancedTotalCount} {t.tracks.solved}
                  </span>
                </div>

                {!prog.isAdvancedUnlocked ? (
                  <div className="space-y-2.5">
                    <div className="p-2.5 rounded-none bg-black/85 border border-amber-500/30 space-y-1.5">
                      <p className="text-[11px] font-medium text-amber-200">
                        {t.tracks.unlockRequirement}
                      </p>
                      <ul className="space-y-1">
                        {prog.missingBasicExercises.map((m) => (
                          <li key={m.id}>
                            <button
                              type="button"
                              onClick={() => onSelectExercise(m)}
                              className="text-[11px] font-mono text-white/75 hover:text-white underline underline-offset-2 text-left"
                            >
                              → {m.title}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1.5 opacity-60">
                      {prog.advancedExercises.map((ex, idx) => (
                        <button
                          key={ex.id}
                          type="button"
                          onClick={() => onSelectExercise(ex)}
                          className="w-full min-h-[40px] px-3 py-2 rounded-none bg-black/55 border border-white/10 text-left flex items-center justify-between gap-3 hover:border-white/25 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Lock className="w-3.5 h-3.5 text-white/40 shrink-0" />
                            <span className="text-xs text-white/60 truncate">
                              {idx + 1}. {ex.title}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-amber-300/80 shrink-0">
                            {t.tracks.locked}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {prog.advancedExercises.map((ex, idx) => {
                      const isSolved = solvedSet.has(ex.id);
                      return (
                        <button
                          key={ex.id}
                          type="button"
                          onClick={() => onSelectExercise(ex)}
                          className="w-full min-h-[44px] px-3 py-2.5 rounded-none bg-neutral-950 hover:bg-neutral-900 border border-white/15 hover:border-white/35 text-left flex items-center justify-between gap-3 transition-colors group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {isSolved ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-white/35 shrink-0" />
                            )}
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-white truncate">
                                {idx + 1}. {ex.title}
                              </div>
                              <div className="text-[10px] font-mono text-white/45 truncate">
                                {ex.topicTag}
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-white/45 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Primary Track CTA */}
              <div className="pt-1">
                {prog.isAdvancedUnlocked && nextAdvanced ? (
                  <button
                    type="button"
                    onClick={() => onSelectExercise(nextAdvanced)}
                    className="w-full min-h-[44px] py-2.5 px-4 rounded-none bg-white hover:bg-neutral-200 text-black font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>{t.tracks.exploreAdvanced}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  nextBasic && (
                    <button
                      type="button"
                      onClick={() => onSelectExercise(nextBasic)}
                      className="w-full min-h-[44px] py-2.5 px-4 rounded-none bg-white hover:bg-neutral-200 text-black font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                    >
                      <span>{t.tracks.enterTrack}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )
                )}
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
};
