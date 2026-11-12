import React, { useState, useEffect } from 'react';
import { HistoryLog, UserStats, Exercise } from '../types/math.ts';
import { MathJaxRenderer } from './MathJaxRenderer.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import {
  X,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Cloud,
  LogIn,
} from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logs: HistoryLog[];
  stats: UserStats;
  allExercises: Exercise[];
  onSelectExercise: (exercise: Exercise) => void;
  onOpenAccount: () => void;
}

const LOGS_PER_PAGE = 4;

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  logs,
  stats,
  allExercises,
  onSelectExercise,
  onOpenAccount,
}) => {
  const [drawerTab, setDrawerTab] = useState<'stats' | 'logs'>('stats');
  const [filter, setFilter] = useState<'all' | 'success' | 'failed'>('all');
  const [logPage, setLogPage] = useState(0);
  const [inspectExercise, setInspectExercise] = useState<Exercise | null>(null);
  const [reviewStepIndex, setReviewStepIndex] = useState(0);
  const { user } = useAuth();
  const { language, t } = useLanguage();

  useEffect(() => {
    setLogPage(0);
  }, [filter, isOpen]);

  if (!isOpen) return null;

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    return log.outcome === filter;
  });

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / LOGS_PER_PAGE));
  const safePage = Math.min(logPage, totalPages - 1);
  const paginatedLogs = filteredLogs.slice(
    safePage * LOGS_PER_PAGE,
    (safePage + 1) * LOGS_PER_PAGE
  );

  const handleReviewClick = (exerciseId: string) => {
    const ex = allExercises.find((e) => e.id === exerciseId);
    if (ex) {
      setInspectExercise(ex);
      setReviewStepIndex(0);
    }
  };

  const getLocalizedTitle = (exerciseId: string, fallback: string) => {
    return allExercises.find((e) => e.id === exerciseId)?.title || fallback;
  };

  const inspectSteps = inspectExercise?.solvingSequences || [];
  const activeInspectStep = inspectSteps[reviewStepIndex] || inspectSteps[0];

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-lg md:max-w-xl h-full bg-black border-l border-white/15 flex flex-col shadow-2xl text-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between shrink-0 gap-3">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white truncate">
              {t.history.title}
            </h2>
            <p className="text-xs text-white/50 mt-0.5 truncate">{t.history.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-neutral-900 transition-colors shrink-0"
            aria-label={t.history.closeAria}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Button-Driven Section Tabs (Stats vs Logs) */}
        <div className="px-4 sm:px-6 pt-3 pb-3 border-b border-white/10 shrink-0">
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-neutral-950 border border-white/10">
            <button
              onClick={() => setDrawerTab('stats')}
              className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                drawerTab === 'stats'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {t.history.tabStats}
            </button>
            <button
              onClick={() => setDrawerTab('logs')}
              className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                drawerTab === 'logs'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span>{t.history.tabLogs}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono tabular-nums ${
                  drawerTab === 'logs' ? 'bg-black/15 text-black' : 'bg-white/10 text-white/70'
                }`}
              >
                {logs.length}
              </span>
            </button>
          </div>
        </div>

        {/* Content Body (No visible scrollbar) */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-6 space-y-5">

          {/* Account Sync Status Banner */}
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            {user ? (
              <div className="flex items-center gap-2.5 min-w-0">
                <Cloud className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-white font-semibold truncate">
                    {t.history.syncedAs} {user.displayName || user.email}
                  </div>
                  <div className="text-[11px] text-white/45 truncate">
                    {t.history.syncedSub}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="text-white/60">
                  {t.history.practicingIn}{' '}
                  <span className="text-white font-medium">{t.history.localMode}</span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenAccount();
                  }}
                  className="min-h-[36px] px-3 py-1.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{t.history.signIn}</span>
                </button>
              </>
            )}
          </div>

          {drawerTab === 'stats' ? (
            /* User Performance Statistics Cards */
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-wider text-white/40 font-semibold block">
                {t.history.masteryStats}
              </span>
              
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3">
                {/* Succeeded Card */}
                <div className="p-4 rounded-xl bg-neutral-950 border border-emerald-500/30 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-emerald-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      {t.history.succeeded}
                    </span>
                    <span className="font-mono tabular-nums text-sm font-bold">
                      {stats.successPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="text-3xl font-bold font-mono tabular-nums text-white">
                      {stats.succeededCount}
                    </div>
                    <div className="text-[11px] text-white/50 mt-0.5">
                      {t.history.succeededSub}
                    </div>
                  </div>
                </div>

                {/* Failed Card */}
                <div className="p-4 rounded-xl bg-neutral-950 border border-red-500/30 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-red-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-red-400" />
                      {t.history.failed}
                    </span>
                    <span className="font-mono tabular-nums text-sm font-bold">
                      {stats.failurePercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="text-3xl font-bold font-mono tabular-nums text-white">
                      {stats.failedCount}
                    </div>
                    <div className="text-[11px] text-white/50 mt-0.5">
                      {t.history.failedSub}
                    </div>
                  </div>
                </div>
              </div>

              {/* Precision Success / Fail Ratio Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] text-white/60 font-mono">
                  <span>{t.history.successLabel} {stats.successPercentage.toFixed(1)}%</span>
                  <span>{t.history.failLabel} {stats.failurePercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-900 overflow-hidden flex">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-500"
                    style={{ width: `${stats.successPercentage}%` }}
                  />
                  <div
                    className="bg-red-500 h-full transition-all duration-500"
                    style={{ width: `${stats.failurePercentage}%` }}
                  />
                </div>
              </div>

              {/* Aggregate Metrics strip */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="p-3 rounded-lg bg-neutral-950 border border-white/10 flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-white/70 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] text-white/50 truncate">{t.history.totalMasteryPoints}</div>
                    <div className="text-sm font-bold font-mono tabular-nums text-white">
                      {stats.totalPoints} {t.startMenu.pts}
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-neutral-950 border border-white/10 flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-white/70 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] text-white/50 truncate">{t.history.totalAttemptTrials}</div>
                    <div className="text-sm font-bold font-mono tabular-nums text-white">
                      {stats.totalAttempts} {t.startMenu.sessions}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick CTA button to inspect attempt logs */}
              <button
                onClick={() => setDrawerTab('logs')}
                className="w-full min-h-[42px] py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/15 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors"
              >
                <span>{t.history.chronologicalLog} ({logs.length})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Button-Paginated History Log Section */
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs uppercase tracking-wider text-white/40 font-semibold">
                  {t.history.chronologicalLog} ({filteredLogs.length})
                </span>

                {/* Filter Tabs */}
                <div className="flex items-center p-0.5 bg-neutral-950 border border-white/10 rounded-lg text-xs">
                  <button
                    onClick={() => setFilter('all')}
                    className={`min-h-[32px] px-2.5 py-1 rounded-md transition-colors ${
                      filter === 'all' ? 'bg-white text-black font-semibold' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {t.history.filterAll}
                  </button>
                  <button
                    onClick={() => setFilter('success')}
                    className={`min-h-[32px] px-2.5 py-1 rounded-md transition-colors ${
                      filter === 'success' ? 'bg-emerald-500 text-black font-semibold' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {t.history.filterSuccess}
                  </button>
                  <button
                    onClick={() => setFilter('failed')}
                    className={`min-h-[32px] px-2.5 py-1 rounded-md transition-colors ${
                      filter === 'failed' ? 'bg-red-500 text-white font-semibold' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {t.history.filterFailed}
                  </button>
                </div>
              </div>

              {filteredLogs.length === 0 ? (
                <div className="p-8 text-center rounded-xl border border-white/10 bg-neutral-950/50">
                  <p className="text-sm text-white/50">{t.history.emptyTitle}</p>
                  <p className="text-xs text-white/30 mt-1">{t.history.emptySub}</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2.5">
                    {paginatedLogs.map((log) => {
                      const isSuccess = log.outcome === 'success';
                      const dateStr = new Date(log.timestamp).toLocaleTimeString(
                        language === 'fr' ? 'fr-FR' : 'en-US',
                        {
                          hour: '2-digit',
                          minute: '2-digit',
                          month: 'short',
                          day: 'numeric',
                        }
                      );
                      const minutes = Math.floor(log.timeSpentSeconds / 60);
                      const seconds = log.timeSpentSeconds % 60;
                      const timeDisplay = `${minutes}m ${seconds}s`;

                      return (
                        <div
                          key={log.id}
                          className="p-3.5 sm:p-4 rounded-xl bg-neutral-950 border border-white/10 hover:border-white/20 transition-all flex flex-col gap-2"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-white leading-snug">
                                {getLocalizedTitle(log.exerciseId, log.exerciseTitle)}
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-white/50 mt-1 font-mono">
                                <span>{dateStr}</span>
                                {log.timeSpentSeconds > 0 && (
                                  <>
                                    <span aria-hidden="true">·</span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {timeDisplay}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Outcome Tag */}
                            <div
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 shrink-0 ${
                                isSuccess
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
                              }`}
                            >
                              {isSuccess ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3" />
                                  +{log.pointsEarned} {t.startMenu.pts}
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3 h-3" />
                                  {t.history.failedTag}
                                </>
                              )}
                            </div>
                          </div>

                          {/* Review Sequence Action */}
                          <div className="pt-2 border-t border-white/5 flex justify-end">
                            <button
                              onClick={() => handleReviewClick(log.exerciseId)}
                              className="min-h-[32px] flex items-center gap-1 text-xs text-white/75 hover:text-white transition-colors group"
                            >
                              <span>{t.history.reviewSequence}</span>
                              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination Controls (Button-Driven Log Browsing) */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between gap-2 pt-2">
                      <button
                        onClick={() => setLogPage((p) => Math.max(0, p - 1))}
                        disabled={safePage === 0}
                        className="min-h-[38px] px-3 py-1.5 rounded-lg bg-neutral-950 border border-white/15 text-xs font-medium text-white hover:bg-neutral-900 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>{t.history.prevPage}</span>
                      </button>

                      <span className="text-xs font-mono text-white/50 tabular-nums">
                        {t.history.pageLabel} {safePage + 1} / {totalPages}
                      </span>

                      <button
                        onClick={() => setLogPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={safePage >= totalPages - 1}
                        className="min-h-[38px] px-3 py-1.5 rounded-lg bg-neutral-950 border border-white/15 text-xs font-medium text-white hover:bg-neutral-900 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
                      >
                        <span>{t.history.nextPage}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Inspect Solving Sequence Modal (Button-Paginated Step Review) */}
        {inspectExercise && (
          <div className="absolute inset-0 z-50 bg-black/95 flex flex-col">
            <div className="p-4 sm:p-6 flex items-center justify-between border-b border-white/10 shrink-0 gap-3">
              <div className="min-w-0">
                <span className="text-xs text-white/50 uppercase tracking-wider font-mono">
                  {t.history.reviewHeader}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white mt-0.5 truncate">
                  {inspectExercise.title}
                </h3>
              </div>
              <button
                onClick={() => setInspectExercise(null)}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-white/60 hover:text-white bg-neutral-900 border border-white/10 shrink-0"
                aria-label={t.history.backToLogs}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-6 space-y-4">
              <div className="p-3.5 sm:p-4 rounded-xl bg-neutral-950 border border-white/10">
                <span className="text-xs text-white/40 block mb-1">{t.history.targetStatement}</span>
                <MathJaxRenderer math={inspectExercise.latexStatement} />
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-neutral-950 border border-emerald-500/30">
                <span className="text-xs text-emerald-400 font-semibold block mb-1">
                  {t.history.finalBenchmarkSolution}
                </span>
                <MathJaxRenderer math={inspectExercise.targetSolution} />
              </div>

              {inspectSteps.length > 0 && activeInspectStep && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs uppercase tracking-wider text-white/40 font-semibold">
                      {t.history.exhaustiveSequence} ({inspectSteps.length} {t.history.stepsUnit})
                    </span>
                    <div className="flex flex-wrap items-center gap-1">
                      {inspectSteps.map((s, idx) => (
                        <button
                          key={s.stepNumber}
                          onClick={() => setReviewStepIndex(idx)}
                          className={`min-h-[32px] min-w-[32px] px-2 rounded-md text-xs font-mono font-semibold border transition-colors ${
                            idx === reviewStepIndex
                              ? 'bg-white text-black border-white'
                              : 'bg-neutral-950 text-white/60 border-white/15 hover:text-white'
                          }`}
                        >
                          {s.stepNumber}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-xl bg-neutral-950 border border-white/10 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-white/60 font-mono">
                      <span>{t.history.stepPrefix}{activeInspectStep.stepNumber} · {activeInspectStep.title}</span>
                      {activeInspectStep.keyRule && (
                        <span className="text-white/40 italic">{activeInspectStep.keyRule}</span>
                      )}
                    </div>
                    <MathJaxRenderer math={activeInspectStep.latexContent} />
                    <p className="text-xs text-white/70 leading-relaxed pt-1 border-t border-white/5">
                      {activeInspectStep.explanation}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => setReviewStepIndex((i) => Math.max(0, i - 1))}
                      disabled={reviewStepIndex === 0}
                      className="min-h-[38px] px-3 py-1.5 rounded-lg bg-neutral-900 border border-white/15 text-xs text-white disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>{t.workspace.prevStep}</span>
                    </button>

                    <button
                      onClick={() => setReviewStepIndex((i) => Math.min(inspectSteps.length - 1, i + 1))}
                      disabled={reviewStepIndex >= inspectSteps.length - 1}
                      className="min-h-[38px] px-3 py-1.5 rounded-lg bg-white text-black font-semibold text-xs disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
                    >
                      <span>{t.workspace.nextStep}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Pinned Modal Footer Actions */}
            <div className="p-4 sm:p-5 border-t border-white/10 flex gap-3 shrink-0 bg-black">
              <button
                onClick={() => {
                  onSelectExercise(inspectExercise);
                  setInspectExercise(null);
                  onClose();
                }}
                className="flex-1 min-h-[42px] py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors"
              >
                {t.history.loadInWorkspace}
              </button>
              <button
                onClick={() => setInspectExercise(null)}
                className="min-h-[42px] px-4 py-2 rounded-xl border border-white/20 text-xs text-white/80 hover:text-white transition-colors"
              >
                {t.history.backToLogs}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
