import { useState, useEffect, useCallback } from 'react';
import { TopicSlug, Exercise, HistoryLog, UserStats } from './types/math.ts';
import { CURATED_EXERCISES } from './data/curatedExercises.ts';
import { getLocalizedTopics, getLocalizedExercises } from './data/curatedExercisesFr.ts';
import { TopBar } from './components/TopBar.tsx';
import { ParticleCanvas } from './components/ParticleCanvas.tsx';
import { SolvingDeck } from './components/SolvingDeck.tsx';
import { LockedProblemCard } from './components/LockedProblemCard.tsx';
import { NextProblemCountdown } from './components/NextProblemCountdown.tsx';
import { calculateScheduleState, ScheduleState } from './lib/problemSchedule.ts';
import { HistoryDrawer } from './components/HistoryDrawer.tsx';
import { StartMenu } from './components/StartMenu.tsx';
import { AccountModal } from './components/AccountModal.tsx';
import { OfflineIndicator } from './components/OfflineIndicator.tsx';
import { useAuth } from './contexts/AuthContext.tsx';
import { useLanguage } from './contexts/LanguageContext.tsx';
import { db, handleFirestoreError, OperationType } from './lib/firebase.ts';
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  query,
  where,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { CheckCircle2, Lock, ChevronLeft, ChevronRight } from 'lucide-react';

const LOCAL_STORAGE_LOGS_KEY = 'mathquest_history_logs_v1';

export default function App() {
  const { user, isAuthReady, syncCloudSchedule, cloudSchedule } = useAuth();
  const { language, t } = useLanguage();
  const [isStartMenu, setIsStartMenu] = useState(true);
  const [activeTopic, setActiveTopic] = useState<TopicSlug>('calculus');
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(CURATED_EXERCISES[0].id);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [historyLogs, setHistoryLogs] = useState<HistoryLog[]>([]);
  const [schedule, setSchedule] = useState<ScheduleState>(calculateScheduleState());

  const localizedTopics = getLocalizedTopics(language);
  const localizedExercises = getLocalizedExercises(language);
  const selectedExercise =
    localizedExercises.find((ex) => ex.id === selectedExerciseId) || localizedExercises[0];

  // Sync schedule state when cloud schedule loads for signed-in user
  useEffect(() => {
    if (cloudSchedule) {
      setSchedule(calculateScheduleState());
    }
  }, [cloudSchedule]);

  // Ticking effect for 5-hour cadence countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSchedule(calculateScheduleState());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleScheduleUpdate = useCallback(
    (newSchedule: ScheduleState) => {
      setSchedule(newSchedule);
      if (user) {
        syncCloudSchedule(newSchedule.startedAt, newSchedule.fastForwardHours);
      }
    },
    [user, syncCloudSchedule]
  );

  // Load history logs: Firestore onSnapshot when authenticated, localStorage/API when guest
  useEffect(() => {
    if (!isAuthReady) return;

    const storageKey = user ? `${LOCAL_STORAGE_LOGS_KEY}_${user.uid}` : LOCAL_STORAGE_LOGS_KEY;

    // 1. Load cached logs for current identity
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setHistoryLogs(parsed);
        } else {
          setHistoryLogs([]);
        }
      } else {
        setHistoryLogs([]);
      }
    } catch (e) {
      console.warn('Could not read cached logs:', e);
      setHistoryLogs([]);
    }

    // 2. If signed in, subscribe to owner-scoped Firestore history_logs
    if (user) {
      const historyQuery = query(
        collection(db, 'history_logs'),
        where('userId', '==', user.uid),
        limit(100)
      );

      const unsubscribe = onSnapshot(
        historyQuery,
        (snapshot) => {
          const remoteLogs: HistoryLog[] = [];
          snapshot.forEach((d) => {
            const val = d.data();
            remoteLogs.push({
              id: d.id,
              exerciseId: val.exerciseId,
              exerciseTitle: val.exerciseTitle || 'Mathematical Exercise',
              topicId: val.topicId || 'calculus',
              outcome: val.outcome,
              pointsEarned: val.pointsEarned || 0,
              timeSpentSeconds: val.timeSpentSeconds || 0,
              timestamp: val.timestamp,
            });
          });
          remoteLogs.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
          setHistoryLogs(remoteLogs);
          try {
            localStorage.setItem(storageKey, JSON.stringify(remoteLogs));
          } catch (e) {
            console.warn('Could not cache user logs:', e);
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'history_logs');
        }
      );

      return () => unsubscribe();
    }

    // 3. Guest mode fallback: REST API endpoint
    fetch('/api/history')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.logs) && data.logs.length > 0) {
          setHistoryLogs((prev) => {
            const merged = [...data.logs];
            const ids = new Set(merged.map((l: HistoryLog) => l.id));
            prev.forEach((l) => {
              if (!ids.has(l.id)) merged.push(l);
            });
            localStorage.setItem(storageKey, JSON.stringify(merged));
            return merged;
          });
        }
      })
      .catch((err) => {
        console.warn('Server history fetch fallback to local:', err);
      });
  }, [isAuthReady, user]);

  // Filter exercises for active topic
  const topicExercises = localizedExercises.filter((ex) => ex.topicId === activeTopic);
  const currentTopic = localizedTopics.find((topic) => topic.slug === activeTopic) || localizedTopics[0];

  // Auto-select first exercise when topic changes if current isn't in topic
  useEffect(() => {
    if (selectedExercise.topicId !== activeTopic) {
      if (topicExercises.length > 0) {
        setSelectedExerciseId(topicExercises[0].id);
      }
    }
  }, [activeTopic, selectedExercise.topicId, topicExercises]);

  // Record an attempt outcome
  const handleRecordAttempt = async (outcome: 'success' | 'failed', timeSpentSeconds: number) => {
    const pointsEarned = outcome === 'success' ? selectedExercise.pointsValue : 0;
    const logId = `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const newLog: HistoryLog = {
      id: logId,
      exerciseId: selectedExercise.id.slice(0, 64),
      exerciseTitle: selectedExercise.title.slice(0, 128),
      topicId: selectedExercise.topicId,
      outcome,
      pointsEarned: Math.max(0, pointsEarned),
      timeSpentSeconds: Math.max(0, timeSpentSeconds),
      timestamp: new Date().toISOString(),
    };

    const storageKey = user ? `${LOCAL_STORAGE_LOGS_KEY}_${user.uid}` : LOCAL_STORAGE_LOGS_KEY;

    // Update state & localStorage immediately
    const updated = [newLog, ...historyLogs];
    setHistoryLogs(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not cache log:', e);
    }

    // Post to Express REST API
    fetch('/api/history/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        exerciseId: selectedExercise.id,
        outcome,
        timeSpentSeconds,
      }),
    }).catch((err) => console.warn('REST log sync deferred:', err));

    // Persist to owner-scoped Firestore collection when signed in
    if (user) {
      const docPath = `history_logs/${logId}`;
      try {
        await setDoc(doc(db, 'history_logs', logId), {
          userId: user.uid,
          exerciseId: newLog.exerciseId,
          exerciseTitle: newLog.exerciseTitle,
          topicId: newLog.topicId,
          outcome: newLog.outcome,
          pointsEarned: newLog.pointsEarned,
          timeSpentSeconds: newLog.timeSpentSeconds,
          timestamp: newLog.timestamp,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes('Missing or insufficient permissions') || msg.includes('permission-denied')) {
          handleFirestoreError(err, OperationType.CREATE, docPath);
        }
        console.info('Firestore log write deferred to offline cache:', err);
      }
    }
  };

  // Calculate live statistics for the History drawer
  const totalAttempts = historyLogs.length;
  const succeededCount = historyLogs.filter((l) => l.outcome === 'success').length;
  const failedCount = historyLogs.filter((l) => l.outcome === 'failed').length;
  const successPercentage = totalAttempts > 0 ? (succeededCount / totalAttempts) * 100 : 0;
  const failurePercentage = totalAttempts > 0 ? (failedCount / totalAttempts) * 100 : 0;
  const totalPoints = historyLogs
    .filter((l) => l.outcome === 'success')
    .reduce((sum, l) => sum + l.pointsEarned, 0);

  const stats: UserStats = {
    succeededCount,
    failedCount,
    totalAttempts,
    successPercentage,
    failurePercentage,
    totalPoints,
  };

  // Find index of current exercise within topic to allow navigating via buttons
  const currentIndex = topicExercises.findIndex((ex) => ex.id === selectedExercise.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < topicExercises.length - 1;
  const handlePreviousExercise = () => {
    if (hasPrevious) {
      setSelectedExerciseId(topicExercises[currentIndex - 1].id);
    }
  };
  const handleNextExercise = () => {
    if (hasNext) {
      setSelectedExerciseId(topicExercises[currentIndex + 1].id);
    }
  };

  const handleStartPracticeFromMenu = (topicSlug?: TopicSlug) => {
    if (topicSlug) {
      setActiveTopic(topicSlug);
      const firstInTopic = localizedExercises.find((e) => e.topicId === topicSlug);
      if (firstInTopic) {
        setSelectedExerciseId(firstInTopic.id);
      }
    }
    setIsStartMenu(false);
  };

  // Check if an exercise is unlocked based on 5-hour cadence
  const isExerciseUnlocked = (ex: Exercise) => {
    const reqHours = ex.unlockHourOffset ?? 0;
    return schedule.elapsedHours >= reqHours;
  };

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col font-sans selection:bg-neutral-800">
      
      {/* Background Math Constellation Particle System */}
      <ParticleCanvas />

      {/* Pristine Top Navigation Bar (Contract compliant) */}
      <TopBar
        activeTopic={activeTopic}
        onSelectTopic={(topic) => {
          setActiveTopic(topic);
          setIsStartMenu(false);
        }}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenStartMenu={() => setIsStartMenu(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        isStartMenu={isStartMenu}
        totalAttempts={totalAttempts}
        schedule={schedule}
        onScheduleUpdate={handleScheduleUpdate}
      />

      {/* Main View: Start Menu or Problem Solving Workspace */}
      {isStartMenu ? (
        <StartMenu
          onStartPractice={handleStartPracticeFromMenu}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenAccount={() => setIsAccountOpen(true)}
          stats={stats}
          schedule={schedule}
          onScheduleUpdate={handleScheduleUpdate}
        />
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 lg:py-8 relative z-10 space-y-4 sm:space-y-6">
          
          {/* Topic Header & Button-Driven Problem Switcher */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-white/50 mb-1">
                <button
                  onClick={() => setIsStartMenu(true)}
                  className="hover:text-white transition-colors min-h-[28px]"
                >
                  {t.topBar.startMenu}
                </button>
                <span aria-hidden="true">&rarr;</span>
                <span className="text-white font-semibold">{currentTopic.title}</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
                {currentTopic.title}
              </h1>
              <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-2xl">
                {currentTopic.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap items-start sm:items-center gap-2.5 sm:gap-3 w-full lg:w-auto">
              {/* Cadence Countdown (hidden on xl+ where TopBar shows it, shown on <xl) */}
              <div className="xl:hidden">
                <NextProblemCountdown
                  schedule={schedule}
                  onScheduleUpdate={handleScheduleUpdate}
                  compact={true}
                />
              </div>

              {/* Clean Button-Driven Problem Switcher (Zero Horizontal Scrollbar) */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
                <button
                  onClick={handlePreviousExercise}
                  disabled={!hasPrevious}
                  className="min-h-[40px] min-w-[40px] px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-white/15 text-white/80 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center"
                  aria-label={t.workspace.prevProblem}
                  title={t.workspace.prevProblem}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {topicExercises.map((ex, index) => {
                  const isSelected = ex.id === selectedExercise.id;
                  const isSolved = historyLogs.some((l) => l.exerciseId === ex.id && l.outcome === 'success');
                  const unlocked = isExerciseUnlocked(ex);

                  return (
                    <button
                      key={ex.id}
                      onClick={() => setSelectedExerciseId(ex.id)}
                      className={`flex items-center justify-center gap-1.5 min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap flex-1 sm:flex-initial ${
                        isSelected
                          ? 'bg-white text-black font-semibold border-white shadow-md'
                          : unlocked
                          ? 'bg-neutral-950/80 text-white/70 hover:text-white border-white/10 hover:border-white/25'
                          : 'bg-neutral-950/40 text-white/40 hover:text-white/60 border-white/5 hover:border-white/15 border-dashed'
                      }`}
                    >
                      {unlocked ? (
                        isSolved ? (
                          <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-emerald-700' : 'text-emerald-400'}`} />
                        ) : null
                      ) : (
                        <Lock className="w-3 h-3 text-white/40 shrink-0" />
                      )}
                      <span>{t.workspace.problemLabel} {index + 1}</span>
                      {!unlocked && (
                        <span className="text-[10px] opacity-60 font-mono">({ex.unlockHourOffset}h)</span>
                      )}
                    </button>
                  );
                })}

                <button
                  onClick={handleNextExercise}
                  disabled={!hasNext}
                  className="min-h-[40px] min-w-[40px] px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-white/15 text-white/80 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center"
                  aria-label={t.workspace.nextProblemShort}
                  title={t.workspace.nextProblemShort}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Primary Interactive Solving Deck or Locked Scheduled View */}
          {isExerciseUnlocked(selectedExercise) ? (
            <SolvingDeck
              exercise={selectedExercise}
              onSuccess={(timeSpent) => handleRecordAttempt('success', timeSpent)}
              onFail={(timeSpent) => handleRecordAttempt('failed', timeSpent)}
              onPreviousExercise={handlePreviousExercise}
              onNextExercise={handleNextExercise}
              hasPrevious={hasPrevious}
              hasNext={hasNext}
            />
          ) : (
            <LockedProblemCard
              exercise={selectedExercise}
              schedule={schedule}
              onScheduleUpdate={handleScheduleUpdate}
              onUnlocked={() => handleScheduleUpdate(calculateScheduleState())}
            />
          )}

        </main>
      )}

      {/* History & Performance Metrics Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        logs={historyLogs}
        stats={stats}
        allExercises={localizedExercises}
        onSelectExercise={(ex) => {
          setSelectedExerciseId(ex.id);
          setActiveTopic(ex.topicId);
          setIsStartMenu(false);
        }}
        onOpenAccount={() => setIsAccountOpen(true)}
      />

      {/* Account Sign-In & Profile Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        stats={stats}
      />

      {/* Offline Toast */}
      <OfflineIndicator />

    </div>
  );
}
