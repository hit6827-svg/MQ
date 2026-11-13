import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  TrackSlug,
  LevelSlug,
  Exercise,
  TrackProgress,
  UserStats,
} from './types/math.ts';
import { CURATED_EXERCISES } from './data/curatedExercises.ts';
import { getLocalizedTracks, getLocalizedExercises } from './data/curatedExercisesFr.ts';
import { computeTrackProgress, evaluateRankProgression } from './lib/ranking.ts';
import { TopBar, NavSection } from './components/TopBar.tsx';
import { TracksOverview } from './components/TracksOverview.tsx';
import { SolvingDeck } from './components/SolvingDeck.tsx';
import { LockedLevelCard } from './components/LockedLevelCard.tsx';
import { AccountPanel } from './components/AccountPanel.tsx';
import { HowItWorksPanel } from './components/HowItWorksPanel.tsx';
import { PerformancePanel } from './components/PerformancePanel.tsx';
import { OfflineIndicator } from './components/OfflineIndicator.tsx';
import { useAuth, CloudProgressState } from './contexts/AuthContext.tsx';
import { useLanguage } from './contexts/LanguageContext.tsx';
import {
  CheckCircle2,
  Lock,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';

const LOCAL_PROGRESS_KEY = 'mathquest_progress_v2';
const LOCAL_TIMERS_KEY = 'mathquest_timers_v1';

interface LocalProgressState {
  solvedExerciseIds: string[];
  verifiedCount: number;
  struggledCount: number;
  defaultTimerMinutes: number;
}

function loadLocalProgress(uid?: string | null): LocalProgressState {
  const key = uid ? `${LOCAL_PROGRESS_KEY}_${uid}` : LOCAL_PROGRESS_KEY;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        solvedExerciseIds: Array.isArray(parsed.solvedExerciseIds)
          ? parsed.solvedExerciseIds.filter((x: unknown): x is string => typeof x === 'string')
          : [],
        verifiedCount:
          typeof parsed.verifiedCount === 'number' ? Math.max(0, parsed.verifiedCount) : 0,
        struggledCount:
          typeof parsed.struggledCount === 'number' ? Math.max(0, parsed.struggledCount) : 0,
        defaultTimerMinutes:
          typeof parsed.defaultTimerMinutes === 'number'
            ? Math.min(180, Math.max(0, parsed.defaultTimerMinutes))
            : 15,
      };
    }
  } catch {
    // ignore read error
  }
  return {
    solvedExerciseIds: [],
    verifiedCount: 0,
    struggledCount: 0,
    defaultTimerMinutes: 15,
  };
}

function saveLocalProgress(progress: LocalProgressState, uid?: string | null) {
  const key = uid ? `${LOCAL_PROGRESS_KEY}_${uid}` : LOCAL_PROGRESS_KEY;
  try {
    localStorage.setItem(key, JSON.stringify(progress));
  } catch {
    // ignore storage write error
  }
}

function loadExerciseTimers(): Record<string, number> {
  try {
    const raw = localStorage.getItem(LOCAL_TIMERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return parsed as Record<string, number>;
      }
    }
  } catch {
    // ignore storage error
  }
  return {};
}

export default function App() {
  const { user, isAuthReady, cloudProgress, syncCloudProgress } = useAuth();
  const { language, t } = useLanguage();

  // Navigation panel state (top bar always visible)
  const [activeNavPanel, setActiveNavPanel] = useState<NavSection>(null);

  // Practice view state: either Track Directory ('overview') or Problem Solving ('workspace')
  const [viewMode, setViewMode] = useState<'overview' | 'workspace'>('overview');
  const [selectedTrackSlug, setSelectedTrackSlug] = useState<TrackSlug>('numbers_structures');
  const [selectedLevel, setSelectedLevel] = useState<LevelSlug>('basic');
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(CURATED_EXERCISES[0].id);

  // Persistent progression (no attempt logs, no points)
  const [progress, setProgress] = useState<LocalProgressState>(() => loadLocalProgress(null));
  // Per-problem custom timer durations chosen by the user
  const [exerciseTimers, setExerciseTimers] = useState<Record<string, number>>(loadExerciseTimers);

  // Hydrate identity progress when auth state becomes ready
  useEffect(() => {
    if (!isAuthReady) return;
    if (user && cloudProgress) {
      setProgress(cloudProgress);
      saveLocalProgress(cloudProgress, user.uid);
    } else if (!user) {
      setProgress(loadLocalProgress(null));
    }
  }, [isAuthReady, user, cloudProgress]);

  const persistProgress = useCallback(
    (next: CloudProgressState) => {
      setProgress(next);
      saveLocalProgress(next, user?.uid);
      if (user) {
        syncCloudProgress(next);
      }
    },
    [user, syncCloudProgress]
  );

  const localizedTracks = useMemo(() => getLocalizedTracks(language), [language]);
  const localizedExercises = useMemo(() => getLocalizedExercises(language), [language]);
  const solvedSet = useMemo(() => new Set(progress.solvedExerciseIds), [progress.solvedExerciseIds]);

  const progressByTrack = useMemo<Record<TrackSlug, TrackProgress>>(
    () => ({
      numbers_structures: computeTrackProgress('numbers_structures', localizedExercises, solvedSet),
      analysis_vectors: computeTrackProgress('analysis_vectors', localizedExercises, solvedSet),
    }),
    [localizedExercises, solvedSet]
  );

  const rankEval = useMemo(
    () => evaluateRankProgression(localizedExercises, progress.solvedExerciseIds, language),
    [localizedExercises, progress.solvedExerciseIds, language]
  );

  const totalTrials = progress.verifiedCount + progress.struggledCount;
  const stats: UserStats = {
    solvedCount: rankEval.solvedCount,
    totalProblems: rankEval.totalProblems,
    verifiedCount: progress.verifiedCount,
    struggledCount: progress.struggledCount,
    totalTrials,
    accuracyPercentage: totalTrials > 0 ? (progress.verifiedCount / totalTrials) * 100 : 0,
  };

  const selectedExercise =
    localizedExercises.find((ex) => ex.id === selectedExerciseId) || localizedExercises[0];
  const currentTrack =
    localizedTracks.find((tr) => tr.slug === selectedTrackSlug) || localizedTracks[0];
  const currentTrackProgress = progressByTrack[selectedTrackSlug];
  const levelExercises =
    selectedLevel === 'basic'
      ? currentTrackProgress.basicExercises
      : currentTrackProgress.advancedExercises;

  const isSelectedExerciseUnlocked =
    selectedExercise.level === 'basic' ||
    progressByTrack[selectedExercise.trackId].isAdvancedUnlocked;

  const currentIndex = levelExercises.findIndex((ex) => ex.id === selectedExercise.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < levelExercises.length - 1;

  const handleToggleNavSection = (section: Exclude<NavSection, null>) => {
    setActiveNavPanel((prev) => (prev === section ? null : section));
  };

  const handleOpenExercise = (exercise: Exercise) => {
    setSelectedTrackSlug(exercise.trackId);
    setSelectedLevel(exercise.level);
    setSelectedExerciseId(exercise.id);
    setViewMode('workspace');
    setActiveNavPanel(null);
  };

  const handleSwitchLevel = (level: LevelSlug) => {
    setSelectedLevel(level);
    const list =
      level === 'basic'
        ? currentTrackProgress.basicExercises
        : currentTrackProgress.advancedExercises;
    if (list.length > 0) {
      setSelectedExerciseId(list[0].id);
    }
  };

  const handlePreviousExercise = () => {
    if (hasPrevious) {
      setSelectedExerciseId(levelExercises[currentIndex - 1].id);
    }
  };

  const handleNextExercise = () => {
    if (hasNext) {
      setSelectedExerciseId(levelExercises[currentIndex + 1].id);
    }
  };

  const handleProofVerified = () => {
    const nextSolved = solvedSet.has(selectedExercise.id)
      ? progress.solvedExerciseIds
      : [...progress.solvedExerciseIds, selectedExercise.id];
    persistProgress({
      ...progress,
      solvedExerciseIds: nextSolved,
      verifiedCount: progress.verifiedCount + 1,
    });
  };

  const handleProofReviewed = () => {
    persistProgress({
      ...progress,
      struggledCount: progress.struggledCount + 1,
    });
  };

  const handleChangeDefaultTimer = (minutes: number) => {
    persistProgress({
      ...progress,
      defaultTimerMinutes: minutes,
    });
  };

  const handleChangeExerciseTimer = (exerciseId: string, minutes: number) => {
    setExerciseTimers((prev) => {
      const updated = { ...prev, [exerciseId]: minutes };
      try {
        localStorage.setItem(LOCAL_TIMERS_KEY, JSON.stringify(updated));
      } catch {
        // ignore storage error
      }
      return updated;
    });
  };

  const activeConfiguredMinutes =
    exerciseTimers[selectedExercise.id] !== undefined
      ? exerciseTimers[selectedExercise.id]
      : progress.defaultTimerMinutes ?? selectedExercise.defaultMinutes;

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col font-sans selection:bg-neutral-800">
      {/* Subtle static dark ambient depth (zero particles) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.06),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.03),transparent_55%)]"
      />

      {/* Persistent Navigation Bar — Always visible on every screen and state with strictly 3 items */}
      <TopBar
        activeSection={activeNavPanel}
        onToggleSection={handleToggleNavSection}
        currentRank={rankEval.currentRank}
        solvedCount={rankEval.solvedCount}
        totalProblems={rankEval.totalProblems}
      />

      {activeNavPanel === 'account' ? (
        <AccountPanel
          onClose={() => setActiveNavPanel(null)}
          rankEval={rankEval}
          defaultTimerMinutes={progress.defaultTimerMinutes}
          onChangeDefaultTimer={handleChangeDefaultTimer}
        />
      ) : activeNavPanel === 'how_it_works' ? (
        <HowItWorksPanel
          onClose={() => setActiveNavPanel(null)}
          rankEval={rankEval}
        />
      ) : activeNavPanel === 'performance' ? (
        <PerformancePanel
          onClose={() => setActiveNavPanel(null)}
          stats={stats}
          rankEval={rankEval}
          tracks={localizedTracks}
          progressByTrack={progressByTrack}
          solvedSet={solvedSet}
          onOpenExercise={handleOpenExercise}
        />
      ) : viewMode === 'overview' ? (
        <TracksOverview
          tracks={localizedTracks}
          progressByTrack={progressByTrack}
          solvedSet={solvedSet}
          onSelectExercise={handleOpenExercise}
        />
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 lg:py-8 relative z-10 space-y-4 sm:space-y-6">
          {/* Track & Level Workspace Header */}
          <div className="flex flex-col gap-4 pb-4 border-b border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setViewMode('overview')}
                className="min-h-[38px] px-3 py-1.5 rounded-none bg-neutral-950 hover:bg-neutral-900 border border-white/15 text-xs font-medium text-white/85 hover:text-white inline-flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t.tracks.backToTracks}</span>
              </button>

              {/* Track & Level Selector Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {(['basic', 'advanced'] as LevelSlug[]).map((lvl) => {
                  const isActive = selectedLevel === lvl;
                  const isLocked = lvl === 'advanced' && !currentTrackProgress.isAdvancedUnlocked;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => handleSwitchLevel(lvl)}
                      className={`min-h-[38px] px-3.5 py-1.5 rounded-none text-xs font-medium border transition-colors inline-flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-white text-black border-white font-semibold'
                          : isLocked
                          ? 'bg-neutral-950 text-amber-300/80 border-amber-500/30 border-dashed hover:border-amber-400/50'
                          : 'bg-neutral-950 text-white/75 border-white/15 hover:text-white hover:border-white/35'
                      }`}
                    >
                      {isLocked && <Lock className="w-3.5 h-3.5 shrink-0" />}
                      <span>
                        {lvl === 'basic' ? t.tracks.basicLevel : t.tracks.advancedLevel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
                  {currentTrack.title}
                </h1>
                <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-2xl">
                  {selectedLevel === 'basic' ? t.tracks.basicDesc : t.tracks.advancedDesc}
                </p>
              </div>

              {/* Problem Switcher within Active Level */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full lg:w-auto">
                <button
                  type="button"
                  onClick={handlePreviousExercise}
                  disabled={!hasPrevious}
                  className="min-h-[40px] min-w-[40px] px-2.5 py-1.5 rounded-none bg-neutral-950 border border-white/15 text-white/80 hover:text-white hover:border-white/35 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center justify-center"
                  aria-label={t.tracks.prevProblem}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {levelExercises.map((ex, index) => {
                  const isSelected = ex.id === selectedExercise.id;
                  const isSolved = solvedSet.has(ex.id);
                  const unlocked =
                    ex.level === 'basic' || currentTrackProgress.isAdvancedUnlocked;

                  return (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() => setSelectedExerciseId(ex.id)}
                      className={`flex items-center justify-center gap-1.5 min-h-[40px] px-3 py-1.5 rounded-none text-xs font-medium border transition-colors whitespace-nowrap flex-1 sm:flex-initial ${
                        isSelected
                          ? 'bg-white text-black font-semibold border-white'
                          : unlocked
                          ? 'bg-neutral-950 text-white/75 hover:text-white border-white/15 hover:border-white/35'
                          : 'bg-neutral-950/70 text-white/45 hover:text-white/70 border-white/10 border-dashed'
                      }`}
                    >
                      {!unlocked ? (
                        <Lock className="w-3 h-3 text-amber-400/80 shrink-0" />
                      ) : isSolved ? (
                        <CheckCircle2
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isSelected ? 'text-emerald-700' : 'text-emerald-400'
                          }`}
                        />
                      ) : null}
                      <span>
                        {t.tracks.problemPrefix} {index + 1}
                      </span>
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={handleNextExercise}
                  disabled={!hasNext}
                  className="min-h-[40px] min-w-[40px] px-2.5 py-1.5 rounded-none bg-neutral-950 border border-white/15 text-white/80 hover:text-white hover:border-white/35 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center justify-center"
                  aria-label={t.tracks.nextProblemShort}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {isSelectedExerciseUnlocked ? (
            <SolvingDeck
              exercise={selectedExercise}
              isSolved={solvedSet.has(selectedExercise.id)}
              configuredMinutes={activeConfiguredMinutes}
              onChangeMinutes={(mins) => handleChangeExerciseTimer(selectedExercise.id, mins)}
              onSuccess={handleProofVerified}
              onReview={handleProofReviewed}
              onPreviousExercise={handlePreviousExercise}
              onNextExercise={handleNextExercise}
              hasPrevious={hasPrevious}
              hasNext={hasNext}
            />
          ) : (
            <LockedLevelCard
              exercise={selectedExercise}
              track={currentTrack}
              trackProgress={currentTrackProgress}
              onJumpToExercise={handleOpenExercise}
              onBackToTracks={() => setViewMode('overview')}
            />
          )}
        </main>
      )}

      <OfflineIndicator />
    </div>
  );
}
