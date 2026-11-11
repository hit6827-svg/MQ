import { useState, useEffect } from 'react';
import { TopicSlug, Exercise, HistoryLog, UserStats } from './types/math.ts';
import { TOPICS, CURATED_EXERCISES } from './data/curatedExercises.ts';
import { TopBar } from './components/TopBar.tsx';
import { ParticleCanvas } from './components/ParticleCanvas.tsx';
import { SolvingDeck } from './components/SolvingDeck.tsx';
import { LockedProblemCard } from './components/LockedProblemCard.tsx';
import { NextProblemCountdown } from './components/NextProblemCountdown.tsx';
import { calculateScheduleState, ScheduleState } from './lib/problemSchedule.ts';
import { HistoryDrawer } from './components/HistoryDrawer.tsx';
import { StartMenu } from './components/StartMenu.tsx';
import { OfflineIndicator } from './components/OfflineIndicator.tsx';
import { db } from './lib/firebase.ts';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { BookOpen, Sparkles, CheckCircle2, Lock } from 'lucide-react';

const LOCAL_STORAGE_LOGS_KEY = 'mathquest_history_logs_v1';

export default function App() {
  const [isStartMenu, setIsStartMenu] = useState(true);
  const [activeTopic, setActiveTopic] = useState<TopicSlug>('calculus');
  const [selectedExercise, setSelectedExercise] = useState<Exercise>(CURATED_EXERCISES[0]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyLogs, setHistoryLogs] = useState<HistoryLog[]>([]);
  const [schedule, setSchedule] = useState<ScheduleState>(calculateScheduleState());

  // Ticking effect for 5-hour cadence countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSchedule(calculateScheduleState());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load initial history logs from localStorage and REST API / Firestore
  useEffect(() => {
    // 1. Initial local cache read
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_LOGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setHistoryLogs(parsed);
        }
      }
    } catch (e) {
      console.warn('Could not read cached logs:', e);
    }

    // 2. Fetch from REST API endpoint
    fetch('/api/history')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.logs) && data.logs.length > 0) {
          setHistoryLogs((prev) => {
            const merged = [...data.logs];
            // ensure no duplicates
            const ids = new Set(merged.map((l: HistoryLog) => l.id));
            prev.forEach((l) => {
              if (!ids.has(l.id)) merged.push(l);
            });
            localStorage.setItem(LOCAL_STORAGE_LOGS_KEY, JSON.stringify(merged));
            return merged;
          });
        }
      })
      .catch((err) => {
        console.warn('Server history fetch fallback to local:', err);
      });

    // 3. Optional Firestore sync
    const syncFirestore = async () => {
      try {
        const q = query(collection(db, 'history_logs'), orderBy('timestamp', 'desc'), limit(50));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const remoteLogs: HistoryLog[] = [];
          snap.forEach((d) => {
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
          if (remoteLogs.length > 0) {
            setHistoryLogs((prev) => {
              const existingIds = new Set(prev.map((l) => l.id));
              const merged = [...prev];
              remoteLogs.forEach((l) => {
                if (!existingIds.has(l.id)) merged.push(l);
              });
              localStorage.setItem(LOCAL_STORAGE_LOGS_KEY, JSON.stringify(merged));
              return merged;
            });
          }
        }
      } catch (err) {
        // Firestore may be offline or in local fallback mode
        console.info('Firestore sync in offline/local state:', err);
      }
    };

    syncFirestore();
  }, []);

  // Filter exercises for active topic
  const topicExercises = CURATED_EXERCISES.filter((ex) => ex.topicId === activeTopic);
  const currentTopic = TOPICS.find((t) => t.slug === activeTopic) || TOPICS[0];

  // Auto-select first exercise when topic changes if current isn't in topic
  useEffect(() => {
    if (selectedExercise.topicId !== activeTopic) {
      if (topicExercises.length > 0) {
        setSelectedExercise(topicExercises[0]);
      }
    }
  }, [activeTopic, selectedExercise.topicId, topicExercises]);

  // Record an attempt outcome
  const handleRecordAttempt = async (outcome: 'success' | 'failed', timeSpentSeconds: number) => {
    const pointsEarned = outcome === 'success' ? selectedExercise.pointsValue : 0;
    const newLog: HistoryLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      exerciseId: selectedExercise.id,
      exerciseTitle: selectedExercise.title,
      topicId: selectedExercise.topicId,
      outcome,
      pointsEarned,
      timeSpentSeconds,
      timestamp: new Date().toISOString(),
    };

    // Update state & localStorage immediately
    const updated = [newLog, ...historyLogs];
    setHistoryLogs(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_LOGS_KEY, JSON.stringify(updated));
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

    // Also persist to Firestore collection
    try {
      await addDoc(collection(db, 'history_logs'), {
        exerciseId: selectedExercise.id,
        exerciseTitle: selectedExercise.title,
        topicId: selectedExercise.topicId,
        outcome,
        pointsEarned,
        timeSpentSeconds,
        timestamp: newLog.timestamp,
      });
    } catch (err) {
      console.info('Firestore log write deferred to offline cache:', err);
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

  // Find index of current exercise within topic to allow advancing
  const currentIndex = topicExercises.findIndex((ex) => ex.id === selectedExercise.id);
  const hasNext = currentIndex >= 0 && currentIndex < topicExercises.length - 1;
  const handleNextExercise = () => {
    if (hasNext) {
      setSelectedExercise(topicExercises[currentIndex + 1]);
    }
  };

  const handleStartPracticeFromMenu = (topicSlug?: TopicSlug) => {
    if (topicSlug) {
      setActiveTopic(topicSlug);
      const firstInTopic = CURATED_EXERCISES.find((e) => e.topicId === topicSlug);
      if (firstInTopic) {
        setSelectedExercise(firstInTopic);
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
        isStartMenu={isStartMenu}
        totalAttempts={totalAttempts}
        schedule={schedule}
        onScheduleUpdate={setSchedule}
      />

      {/* Main View: Start Menu or Problem Solving Workspace */}
      {isStartMenu ? (
        <StartMenu
          onStartPractice={handleStartPracticeFromMenu}
          onOpenHistory={() => setIsHistoryOpen(true)}
          stats={stats}
          schedule={schedule}
          onScheduleUpdate={setSchedule}
        />
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8 relative z-10 space-y-6">
          
          {/* Topic Header & Problem Switcher */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-white/50 mb-1">
                <button
                  onClick={() => setIsStartMenu(true)}
                  className="hover:text-white transition-colors"
                >
                  Start Menu
                </button>
                <span aria-hidden="true">&rarr;</span>
                <span className="text-white font-semibold">{currentTopic.title}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                {currentTopic.title}
              </h1>
              <p className="text-xs text-white/60 mt-1 max-w-2xl">
                {currentTopic.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {/* Cadence Countdown */}
              <NextProblemCountdown
                schedule={schedule}
                onScheduleUpdate={setSchedule}
                compact={true}
              />

              {/* Clean Problem Selector Strip with NO names after it */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar shrink-0 max-w-full">
                {topicExercises.map((ex, index) => {
                  const isSelected = ex.id === selectedExercise.id;
                  const isSolved = historyLogs.some((l) => l.exerciseId === ex.id && l.outcome === 'success');
                  const unlocked = isExerciseUnlocked(ex);

                  return (
                    <button
                      key={ex.id}
                      onClick={() => setSelectedExercise(ex)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap ${
                        isSelected
                          ? 'bg-white text-black font-semibold border-white shadow-md'
                          : unlocked
                          ? 'bg-neutral-950/80 text-white/70 hover:text-white border-white/10 hover:border-white/25'
                          : 'bg-neutral-950/40 text-white/40 hover:text-white/60 border-white/5 hover:border-white/15 border-dashed'
                      }`}
                    >
                      {unlocked ? (
                        isSolved ? (
                          <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-700' : 'text-emerald-400'}`} />
                        ) : null
                      ) : (
                        <Lock className="w-3 h-3 text-white/40" />
                      )}
                      <span>Problem {index + 1}</span>
                      {!unlocked && (
                        <span className="text-[10px] opacity-60 font-mono">({ex.unlockHourOffset}h)</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Primary Interactive Solving Deck or Locked Scheduled View */}
          {isExerciseUnlocked(selectedExercise) ? (
            <SolvingDeck
              exercise={selectedExercise}
              onSuccess={(timeSpent) => handleRecordAttempt('success', timeSpent)}
              onFail={(timeSpent) => handleRecordAttempt('failed', timeSpent)}
              onNextExercise={handleNextExercise}
              hasNext={hasNext}
            />
          ) : (
            <LockedProblemCard
              exercise={selectedExercise}
              schedule={schedule}
              onScheduleUpdate={setSchedule}
              onUnlocked={() => setSchedule(calculateScheduleState())}
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
        allExercises={CURATED_EXERCISES}
        onSelectExercise={(ex) => {
          setSelectedExercise(ex);
          setActiveTopic(ex.topicId);
          setIsStartMenu(false);
        }}
      />

      {/* Offline Toast */}
      <OfflineIndicator />

    </div>
  );
}
