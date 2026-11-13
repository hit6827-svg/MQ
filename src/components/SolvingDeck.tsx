import React, { useState, useEffect } from 'react';
import { Exercise } from '../types/math.ts';
import { MathJaxRenderer } from './MathJaxRenderer.tsx';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import confetti from 'canvas-confetti';
import {
  Eye,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Check,
  Layers,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Minus,
  Plus,
} from 'lucide-react';

interface SolvingDeckProps {
  exercise: Exercise;
  isSolved: boolean;
  configuredMinutes: number;
  onChangeMinutes: (minutes: number) => void;
  onSuccess: () => void;
  onReview: () => void;
  onPreviousExercise?: () => void;
  onNextExercise?: () => void;
  hasPrevious?: boolean;
  hasNext: boolean;
}

const TIMER_PRESETS = [0, 5, 10, 15, 25, 45];

function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export const SolvingDeck: React.FC<SolvingDeckProps> = ({
  exercise,
  isSolved,
  configuredMinutes,
  onChangeMinutes,
  onSuccess,
  onReview,
  onPreviousExercise,
  onNextExercise,
  hasPrevious = false,
  hasNext,
}) => {
  const { t } = useLanguage();

  // Proof reveal & self-verification state
  const [isSolutionRevealed, setIsSolutionRevealed] = useState(false);
  const [outcome, setOutcome] = useState<'idle' | 'success' | 'review'>('idle');
  const [showSequences, setShowSequences] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [viewAllSteps, setViewAllSteps] = useState(false);

  // Per-problem user-chosen countdown (or stopwatch if configuredMinutes === 0)
  const [secondsValue, setSecondsValue] = useState<number>(
    configuredMinutes > 0 ? configuredMinutes * 60 : 0
  );
  const [isRunning, setIsRunning] = useState(false);

  // Reset states when exercise changes
  useEffect(() => {
    setIsSolutionRevealed(false);
    setOutcome('idle');
    setShowSequences(false);
    setStepIndex(0);
    setViewAllSteps(false);
    setIsRunning(false);
    setSecondsValue(configuredMinutes > 0 ? configuredMinutes * 60 : 0);
  }, [exercise.id, configuredMinutes]);

  // Tick timer
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSecondsValue((prev) => {
        if (configuredMinutes === 0) {
          return prev + 1;
        }
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, configuredMinutes]);

  const handleApplyMinutes = (mins: number) => {
    const clamped = Math.min(180, Math.max(0, mins));
    setIsRunning(false);
    onChangeMinutes(clamped);
    setSecondsValue(clamped > 0 ? clamped * 60 : 0);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setSecondsValue(configuredMinutes > 0 ? configuredMinutes * 60 : 0);
  };

  const handleSuccessClick = () => {
    setIsRunning(false);
    setOutcome('success');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10B981', '#34D399', '#ffffff'],
    });
    onSuccess();
  };

  const handleReviewClick = () => {
    setIsRunning(false);
    setOutcome('review');
    setShowSequences(true);
    setStepIndex(0);
    onReview();
  };

  const steps = exercise.solvingSequences;
  const activeStep = steps[stepIndex] || steps[0];
  const isTimeUp = configuredMinutes > 0 && secondsValue === 0 && !isRunning;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* User-Chosen Problem Timer Bar */}
      <div className="p-3.5 sm:p-5 rounded-none bg-neutral-950/70 backdrop-blur-xl border border-white/15 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center justify-between lg:justify-start gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-none bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-white/80" />
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-white/50">
                {t.timer.title}
              </div>
              <div
                className={`text-xl sm:text-2xl font-mono font-bold tabular-nums leading-tight ${
                  isTimeUp ? 'text-amber-400' : 'text-white'
                }`}
              >
                {formatClock(secondsValue)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsRunning((r) => !r)}
              className="min-h-[38px] px-3 py-1.5 rounded-none bg-white hover:bg-neutral-200 text-black font-semibold text-xs flex items-center gap-1.5 transition-all"
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isRunning ? t.timer.pause : t.timer.start}</span>
            </button>
            <button
              type="button"
              onClick={handleResetTimer}
              className="min-h-[38px] px-2.5 py-1.5 rounded-none bg-black/70 hover:bg-neutral-900/90 backdrop-blur-md border border-white/15 text-white/80 text-xs flex items-center gap-1 transition-all"
              title={t.timer.reset}
              aria-label={t.timer.reset}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.timer.reset}</span>
            </button>
          </div>
        </div>

        {/* Custom Duration Selector */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono text-white/45 mr-1 hidden sm:inline">
            {t.timer.chooseDuration}
          </span>
          {TIMER_PRESETS.map((mins) => {
            const active = configuredMinutes === mins;
            return (
              <button
                key={mins}
                type="button"
                onClick={() => handleApplyMinutes(mins)}
                className={`min-h-[34px] px-2.5 py-1 rounded-none text-[11px] font-mono border transition-all ${
                  active
                    ? 'bg-white text-black border-white font-semibold'
                    : 'bg-black/70 backdrop-blur-md text-white/70 border-white/15 hover:text-white hover:border-white/35'
                }`}
              >
                {mins === 0 ? t.timer.untimed : `${mins}${t.timer.minUnit[0]}`}
              </button>
            );
          })}
          <div className="flex items-center gap-1 ml-0.5 pl-1.5 border-l border-white/10">
            <button
              type="button"
              onClick={() => handleApplyMinutes(Math.max(0, configuredMinutes - 1))}
              disabled={configuredMinutes <= 0}
              className="min-h-[34px] min-w-[34px] rounded-none bg-black/70 backdrop-blur-md border border-white/15 text-white/75 hover:text-white disabled:opacity-30 flex items-center justify-center"
              aria-label="-1 minute"
            >
              <Minus className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => handleApplyMinutes(Math.min(180, configuredMinutes + 1))}
              className="min-h-[34px] min-w-[34px] rounded-none bg-black/70 backdrop-blur-md border border-white/15 text-white/75 hover:text-white flex items-center justify-center"
              aria-label="+1 minute"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {isTimeUp && (
        <div className="px-4 py-2.5 rounded-none bg-amber-950/40 backdrop-blur-md border border-amber-500/35 text-xs text-amber-200 font-medium text-center">
          {t.timer.timeUp}
        </div>
      )}

      {/* Exercise Main Card */}
      <div className="p-4 sm:p-6 lg:p-8 rounded-none bg-neutral-950/70 backdrop-blur-xl border border-white/15 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 pb-3 sm:pb-4 border-b border-white/10 font-mono text-xs">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-white/55">
            <span className="text-white font-semibold">{exercise.title}</span>
            <span aria-hidden="true">·</span>
            <span>{exercise.topicTag}</span>
            <span aria-hidden="true">·</span>
            <span>
              {exercise.level === 'basic' ? t.tracks.basicLevel : t.tracks.advancedLevel}
            </span>
          </div>

          {isSolved && (
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold text-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t.workspace.alreadySolved}</span>
            </span>
          )}
        </div>

        {/* MathJax Problem Statement */}
        <div className="py-4 sm:py-6">
          <span className="text-[11px] sm:text-xs uppercase tracking-wider text-white/40 font-semibold block mb-2 font-mono">
            {t.workspace.problemStatement}
          </span>
          <div className="text-base sm:text-lg lg:text-xl font-medium text-white leading-relaxed">
            <MathJaxRenderer math={exercise.latexStatement} />
          </div>

          {exercise.theoremContext && (
            <div className="mt-4 pt-3 border-t border-white/10 flex items-start sm:items-center gap-2 text-xs text-white/60">
              <BookOpen className="w-4 h-4 text-white/50 shrink-0 mt-0.5 sm:mt-0" />
              <span>
                {t.workspace.contextInvariant}{' '}
                <strong className="text-white font-medium">{exercise.theoremContext}</strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Self-Verification & Outcome Deck */}
      <div className="p-4 sm:p-6 lg:p-8 rounded-none bg-neutral-950/70 backdrop-blur-xl border border-white/15 space-y-4 sm:space-y-6">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white">
            {t.workspace.selfVerificationTitle}
          </h3>
          <p className="text-xs text-white/55 mt-0.5 leading-relaxed">
            {t.workspace.selfVerificationDesc}
          </p>
        </div>

        {!isSolutionRevealed ? (
          <div className="p-4 sm:p-6 rounded-none bg-neutral-900/55 backdrop-blur-md border border-white/15 text-center space-y-4">
            <p className="text-xs text-white/70 max-w-md mx-auto leading-relaxed">
              {t.workspace.readyToVerify}
            </p>
            <button
              type="button"
              onClick={() => setIsSolutionRevealed(true)}
              className="w-full sm:w-auto min-h-[44px] py-3 px-6 rounded-none bg-white hover:bg-neutral-200 text-black font-semibold text-xs inline-flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99]"
            >
              <Eye className="w-4 h-4" />
              <span>{t.workspace.revealTargetSolution}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {/* Benchmark Conclusion Box */}
            <div className="p-4 sm:p-5 rounded-none bg-black/70 backdrop-blur-md border border-white/20">
              <span className="text-[11px] uppercase tracking-wider text-white/50 font-semibold block mb-2 font-mono">
                {t.workspace.benchmarkSolution}
              </span>
              <div className="text-base sm:text-lg text-white font-medium py-1">
                <MathJaxRenderer math={exercise.targetSolution} />
              </div>
            </div>

            {outcome === 'idle' && (
              <div className="space-y-3 pt-2 border-t border-white/10">
                <span className="text-xs text-white/75 block font-medium">
                  {t.workspace.didYouSucceed}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={handleSuccessClick}
                    className="min-h-[52px] py-3.5 px-4 rounded-none bg-emerald-600/90 hover:bg-emerald-500 backdrop-blur-md text-white font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-emerald-950/50 active:scale-[0.99]"
                  >
                    <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                    <div className="text-left">
                      <div className="text-xs font-bold leading-none">{t.workspace.iSucceeded}</div>
                      <div className="text-[10px] font-normal text-white/85 mt-0.5">
                        {t.workspace.iSucceededSub}
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={handleReviewClick}
                    className="min-h-[52px] py-3.5 px-4 rounded-none bg-red-600/90 hover:bg-red-500 backdrop-blur-md text-white font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-red-950/50 active:scale-[0.99]"
                  >
                    <XCircle className="w-5 h-5 text-white shrink-0" />
                    <div className="text-left">
                      <div className="text-xs font-bold leading-none">{t.workspace.iStruggled}</div>
                      <div className="text-[10px] font-normal text-white/85 mt-0.5">
                        {t.workspace.iStruggledSub}
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {outcome === 'success' && (
              <div className="p-4 sm:p-5 rounded-none bg-emerald-950/35 backdrop-blur-md border border-emerald-500/35 text-center space-y-3">
                <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-semibold text-sm">
                  <Check className="w-4 h-4" />
                  <span>{t.workspace.verifiedCorrect}</span>
                </div>
                <p className="text-xs text-white/65">{t.workspace.verifiedDesc}</p>
                <div className="pt-1 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSequences(!showSequences);
                      setStepIndex(0);
                    }}
                    className="w-full sm:w-auto min-h-[40px] px-4 py-2 rounded-none border border-white/20 text-xs text-white/85 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    {showSequences ? t.workspace.hideSequences : t.workspace.inspectDerivation}
                  </button>

                  {hasNext && onNextExercise && (
                    <button
                      type="button"
                      onClick={onNextExercise}
                      className="w-full sm:w-auto min-h-[40px] px-4 py-2 rounded-none bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors inline-flex items-center justify-center gap-1.5"
                    >
                      <span>{t.workspace.nextProblem}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {outcome === 'review' && (
              <div className="p-4 sm:p-5 rounded-none bg-red-950/35 backdrop-blur-md border border-red-500/35 text-center space-y-2.5">
                <div className="flex items-center justify-center gap-1.5 text-red-400 font-semibold text-sm">
                  <XCircle className="w-4 h-4" />
                  <span>{t.workspace.trialRecorded}</span>
                </div>
                <p className="text-xs text-white/65">{t.workspace.trialRecordedDesc}</p>
                {hasNext && onNextExercise && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={onNextExercise}
                      className="w-full sm:w-auto min-h-[40px] px-4 py-2 rounded-none bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors inline-flex items-center justify-center gap-1.5"
                    >
                      <span>{t.workspace.proceedToNext}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Button-Paginated Step-by-Step Proof Sequences */}
      {showSequences && steps.length > 0 && (
        <div className="p-4 sm:p-6 lg:p-8 rounded-none bg-neutral-950/70 backdrop-blur-xl border border-white/20 space-y-4 sm:space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                {t.workspace.pedagogicalSequences}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                {t.workspace.fullDerivation}
              </h3>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-mono text-white/50 tabular-nums">
                {steps.length} {t.workspace.sequentialSteps}
              </span>
              <button
                type="button"
                onClick={() => setViewAllSteps((v) => !v)}
                className="min-h-[36px] px-3 py-1.5 rounded-none bg-neutral-900/75 hover:bg-neutral-800 backdrop-blur-md border border-white/15 text-xs font-medium text-white/85 flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <Layers className="w-3.5 h-3.5 text-white/70" />
                <span>{viewAllSteps ? t.workspace.stepByStepMode : t.workspace.allStepsMode}</span>
              </button>
            </div>
          </div>

          {!viewAllSteps ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {steps.map((s, idx) => (
                    <button
                      key={s.stepNumber}
                      type="button"
                      onClick={() => setStepIndex(idx)}
                      className={`min-h-[38px] min-w-[38px] px-2.5 py-1 rounded-none text-xs font-mono font-semibold border transition-all ${
                        idx === stepIndex
                          ? 'bg-white text-black border-white'
                          : 'bg-black/70 backdrop-blur-md text-white/60 border-white/15 hover:text-white hover:border-white/35'
                      }`}
                    >
                      {s.stepNumber}
                    </button>
                  ))}
                </div>

                <span className="text-xs font-mono text-white/50 tabular-nums">
                  {t.workspace.stepLabel} {stepIndex + 1} {t.workspace.stepOf} {steps.length}
                </span>
              </div>

              <div className="p-4 sm:p-5 rounded-none bg-black/65 backdrop-blur-md border border-white/15 space-y-3 relative overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded-none bg-white/10 text-white font-bold">
                      {t.workspace.stepLabel} {activeStep.stepNumber}
                    </span>
                    <span className="text-white font-semibold">{activeStep.title}</span>
                  </div>

                  {activeStep.keyRule && (
                    <span className="text-white/50 text-[11px] italic">
                      {t.workspace.invariantLabel} {activeStep.keyRule}
                    </span>
                  )}
                </div>

                <div className="text-sm sm:text-base text-white/95 py-2.5 px-3 rounded-none bg-neutral-950/75 border border-white/10">
                  <MathJaxRenderer math={activeStep.latexContent} />
                </div>

                <p className="text-xs sm:text-sm text-white/75 leading-relaxed pt-1">
                  {activeStep.explanation}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
                  disabled={stepIndex === 0}
                  className="min-h-[42px] px-4 py-2 rounded-none bg-neutral-900/75 hover:bg-neutral-800 backdrop-blur-md disabled:opacity-35 disabled:pointer-events-none border border-white/15 text-xs font-medium text-white flex items-center gap-1.5 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{t.workspace.prevStep}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStepIndex((i) => Math.min(steps.length - 1, i + 1))}
                  disabled={stepIndex >= steps.length - 1}
                  className="min-h-[42px] px-4 py-2 rounded-none bg-white hover:bg-neutral-200 disabled:opacity-35 disabled:pointer-events-none text-xs font-semibold text-black flex items-center gap-1.5 transition-all"
                >
                  <span>{t.workspace.nextStep}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-4 sm:p-5 rounded-none bg-black/65 backdrop-blur-md border border-white/15 space-y-3 relative overflow-hidden"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded-none bg-white/10 text-white font-bold">
                        {t.workspace.stepLabel} {step.stepNumber}
                      </span>
                      <span className="text-white font-semibold">{step.title}</span>
                    </div>

                    {step.keyRule && (
                      <span className="text-white/50 text-[11px] italic">
                        {t.workspace.invariantLabel} {step.keyRule}
                      </span>
                    )}
                  </div>

                  <div className="text-sm sm:text-base text-white/95 py-2.5 px-3 rounded-none bg-neutral-950/75 border border-white/10">
                    <MathJaxRenderer math={step.latexContent} />
                  </div>

                  <p className="text-xs sm:text-sm text-white/75 leading-relaxed pt-1">
                    {step.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bottom Problem Traversal Bar */}
      {(hasPrevious || hasNext) && (
        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            type="button"
            onClick={onPreviousExercise}
            disabled={!hasPrevious || !onPreviousExercise}
            className="min-h-[42px] px-4 py-2 rounded-none bg-neutral-950/75 hover:bg-neutral-900 backdrop-blur-md disabled:opacity-30 disabled:pointer-events-none border border-white/15 text-xs font-medium text-white flex items-center gap-1.5 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.workspace.prevProblem}</span>
          </button>

          <button
            type="button"
            onClick={onNextExercise}
            disabled={!hasNext || !onNextExercise}
            className="min-h-[42px] px-4 py-2 rounded-none bg-neutral-950/75 hover:bg-neutral-900 backdrop-blur-md disabled:opacity-30 disabled:pointer-events-none border border-white/15 text-xs font-medium text-white flex items-center gap-1.5 transition-all"
          >
            <span>{t.workspace.nextProblem}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
