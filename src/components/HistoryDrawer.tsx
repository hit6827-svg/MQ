import React, { useState } from 'react';
import { HistoryLog, UserStats, Exercise } from '../types/math.ts';
import { MathJaxRenderer } from './MathJaxRenderer.tsx';
import { X, CheckCircle2, XCircle, Clock, Award, BookOpen, ChevronRight } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logs: HistoryLog[];
  stats: UserStats;
  allExercises: Exercise[];
  onSelectExercise: (exercise: Exercise) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  logs,
  stats,
  allExercises,
  onSelectExercise,
}) => {
  const [filter, setFilter] = useState<'all' | 'success' | 'failed'>('all');
  const [inspectExercise, setInspectExercise] = useState<Exercise | null>(null);

  if (!isOpen) return null;

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    return log.outcome === filter;
  });

  const handleReviewClick = (exerciseId: string) => {
    const ex = allExercises.find((e) => e.id === exerciseId);
    if (ex) {
      setInspectExercise(ex);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-xl h-full bg-black border-l border-white/15 flex flex-col shadow-2xl text-white overflow-hidden">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">Performance & History</h2>
            <p className="text-xs text-white/50 mt-0.5">Comprehensive audit of problem-solving trials</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-neutral-900 transition-colors"
            aria-label="Close History Panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* User Performance Statistics Cards */}
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-wider text-white/40 font-semibold">Mastery Statistics</span>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Succeeded Card */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-emerald-500/30 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-emerald-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Succeeded
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
                    Exercises verified correct
                  </div>
                </div>
              </div>

              {/* Failed Card */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-red-500/30 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-red-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-red-400" />
                    Failed
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
                    Sequences unlocked for review
                  </div>
                </div>
              </div>
            </div>

            {/* Precision Success / Fail Ratio Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] text-white/60 font-mono">
                <span>Success: {stats.successPercentage.toFixed(1)}%</span>
                <span>Fail: {stats.failurePercentage.toFixed(1)}%</span>
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
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="p-2.5 rounded-lg bg-neutral-950 border border-white/10 flex items-center gap-2.5">
                <Award className="w-4 h-4 text-white/70" />
                <div>
                  <div className="text-[10px] text-white/50">Total Mastery Points</div>
                  <div className="text-sm font-bold font-mono tabular-nums text-white">{stats.totalPoints} pts</div>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-950 border border-white/10 flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-white/70" />
                <div>
                  <div className="text-[10px] text-white/50">Total Attempt Trials</div>
                  <div className="text-sm font-bold font-mono tabular-nums text-white">{stats.totalAttempts} sessions</div>
                </div>
              </div>
            </div>
          </div>

          {/* History Log Section */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-white/40 font-semibold">
                Chronological Log ({filteredLogs.length})
              </span>

              {/* Filter Tabs */}
              <div className="flex items-center p-0.5 bg-neutral-950 border border-white/10 rounded-lg text-xs">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    filter === 'all' ? 'bg-white text-black font-semibold' : 'text-white/60 hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('success')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    filter === 'success' ? 'bg-emerald-500 text-black font-semibold' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Success
                </button>
                <button
                  onClick={() => setFilter('failed')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    filter === 'failed' ? 'bg-red-500 text-white font-semibold' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Failed
                </button>
              </div>
            </div>

            {filteredLogs.length === 0 ? (
              <div className="p-8 text-center rounded-xl border border-white/10 bg-neutral-950/50">
                <p className="text-sm text-white/50">No practice attempts recorded yet.</p>
                <p className="text-xs text-white/30 mt-1">Start solving curated exercises in the workspace to build your history.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredLogs.map((log) => {
                  const isSuccess = log.outcome === 'success';
                  const dateStr = new Date(log.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    month: 'short',
                    day: 'numeric',
                  });
                  const minutes = Math.floor(log.timeSpentSeconds / 60);
                  const seconds = log.timeSpentSeconds % 60;
                  const timeDisplay = `${minutes}m ${seconds}s`;

                  return (
                    <div
                      key={log.id}
                      className="p-4 rounded-xl bg-neutral-950 border border-white/10 hover:border-white/20 transition-all flex flex-col gap-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-white leading-snug">
                            {log.exerciseTitle}
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
                              +{log.pointsEarned} pts
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              Failed
                            </>
                          )}
                        </div>
                      </div>

                      {/* Review Sequence Action */}
                      <div className="pt-2 border-t border-white/5 flex justify-end">
                        <button
                          onClick={() => handleReviewClick(log.exerciseId)}
                          className="flex items-center gap-1 text-xs text-white/70 hover:text-white transition-colors group"
                        >
                          <span>Review Solving Sequence</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Inspect Solving Sequence Modal */}
        {inspectExercise && (
          <div className="absolute inset-0 z-50 bg-black/90 p-6 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
              <div>
                <span className="text-xs text-white/50 uppercase tracking-wider font-mono">Curated Derivation Review</span>
                <h3 className="text-base font-bold text-white mt-0.5">{inspectExercise.title}</h3>
              </div>
              <button
                onClick={() => setInspectExercise(null)}
                className="p-1.5 rounded-lg text-white/60 hover:text-white bg-neutral-900 border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="p-4 rounded-xl bg-neutral-950 border border-white/10">
                <span className="text-xs text-white/40 block mb-1">Target Statement</span>
                <MathJaxRenderer math={inspectExercise.latexStatement} />
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-emerald-500/30">
                <span className="text-xs text-emerald-400 font-semibold block mb-1">Final Benchmark Solution</span>
                <MathJaxRenderer math={inspectExercise.targetSolution} />
              </div>

              <div className="space-y-3">
                <span className="text-xs uppercase tracking-wider text-white/40 font-semibold block">
                  Exhaustive Sequence of Solving ({inspectExercise.solvingSequences.length} Steps)
                </span>

                {inspectExercise.solvingSequences.map((step) => (
                  <div key={step.stepNumber} className="p-4 rounded-xl bg-neutral-950 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs text-white/60 font-mono">
                      <span>Step 0{step.stepNumber} · {step.title}</span>
                      {step.keyRule && <span className="text-white/40 italic">{step.keyRule}</span>}
                    </div>
                    <MathJaxRenderer math={step.latexContent} />
                    <p className="text-xs text-white/70 leading-relaxed pt-1 border-t border-white/5">
                      {step.explanation}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => {
                    onSelectExercise(inspectExercise);
                    setInspectExercise(null);
                    onClose();
                  }}
                  className="flex-1 py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors"
                >
                  Load in Workspace
                </button>
                <button
                  onClick={() => setInspectExercise(null)}
                  className="px-4 py-2 rounded-lg border border-white/20 text-xs text-white/80 hover:text-white transition-colors"
                >
                  Back to Logs
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
