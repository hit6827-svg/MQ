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
} from 'lucide-react';

interface SolvingDeckProps {
  exercise: Exercise;
  onSuccess: (timeSpent: number) => void;
  onFail: (timeSpent: number) => void;
  onPreviousExercise?: () => void;
  onNextExercise?: () => void;
  hasPrevious?: boolean;
  hasNext: boolean;
}

export const SolvingDeck: React.FC<SolvingDeckProps> = ({
  exercise,
  onSuccess,
  onFail,
  onPreviousExercise,
  onNextExercise,
  hasPrevious = false,
  hasNext,
}) => {
  const { t } = useLanguage();

  // Solution reveal & outcome state
  const [isSolutionRevealed, setIsSolutionRevealed] = useState(false);
  const [outcome, setOutcome] = useState<'idle' | 'success' | 'failed'>('idle');
  const [showSequences, setShowSequences] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [viewAllSteps, setViewAllSteps] = useState(false);

  // Reset states when exercise changes
  useEffect(() => {
    setIsSolutionRevealed(false);
    setOutcome('idle');
    setShowSequences(false);
    setStepIndex(0);
    setViewAllSteps(false);
  }, [exercise.id]);

  const handleSuccessClick = () => {
    setOutcome('success');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10B981', '#34D399', '#ffffff'],
    });
    onSuccess(0);
  };

  const handleFailClick = () => {
    setOutcome('failed');
    setShowSequences(true);
    setStepIndex(0);
    onFail(0);
  };

  const localizedDifficulty = t.workspace.difficulty[exercise.difficulty] || exercise.difficulty;
  const steps = exercise.solvingSequences;
  const activeStep = steps[stepIndex] || steps[0];

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Exercise Main Card */}
      <div className="p-4 sm:p-6 lg:p-8 rounded-2xl bg-neutral-950 border border-white/15 shadow-xl relative overflow-hidden">
        
        {/* Category & Difficulty metadata (Unboxed clean typography) */}
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 pb-3 sm:pb-4 border-b border-white/10 font-mono text-xs">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-white/50">
            <span className="text-white font-semibold">{exercise.title}</span>
            <span aria-hidden="true">·</span>
            <span>{localizedDifficulty}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-semibold tabular-nums">
              {exercise.pointsValue} {t.workspace.points}
            </span>
          </div>
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
      <div className="p-4 sm:p-6 lg:p-8 rounded-2xl bg-neutral-950 border border-white/15 space-y-4 sm:space-y-6">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white">{t.workspace.selfVerificationTitle}</h3>
          <p className="text-xs text-white/50 mt-0.5 leading-relaxed">
            {t.workspace.selfVerificationDesc}
          </p>
        </div>

        {/* Reveal Benchmark Solution Action */}
        {!isSolutionRevealed ? (
          <div className="p-4 sm:p-6 rounded-xl bg-neutral-900/60 border border-white/10 text-center space-y-4">
            <p className="text-xs text-white/70 max-w-md mx-auto leading-relaxed">
              {t.workspace.readyToVerify}
            </p>
            <button
              onClick={() => setIsSolutionRevealed(true)}
              className="w-full sm:w-auto min-h-[44px] py-3 px-6 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs inline-flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99]"
            >
              <Eye className="w-4 h-4" />
              <span>{t.workspace.revealTargetSolution}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            
            {/* Benchmark Solution Box */}
            <div className="p-4 sm:p-5 rounded-xl bg-black border border-white/20">
              <span className="text-[11px] uppercase tracking-wider text-white/50 font-semibold block mb-2 font-mono">
                {t.workspace.benchmarkSolution}
              </span>
              <div className="text-base sm:text-lg text-white font-medium py-1">
                <MathJaxRenderer math={exercise.targetSolution} />
              </div>
            </div>

            {/* Outcome Gate Instructions & Actions */}
            {outcome === 'idle' && (
              <div className="space-y-3 pt-2 border-t border-white/10">
                <span className="text-xs text-white/70 block font-medium">
                  {t.workspace.didYouSucceed}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  
                  {/* Green Success Button */}
                  <button
                    onClick={handleSuccessClick}
                    className="min-h-[52px] py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-emerald-950/50 active:scale-[0.99]"
                  >
                    <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                    <div className="text-left">
                      <div className="text-xs font-bold leading-none">{t.workspace.iSucceeded}</div>
                      <div className="text-[10px] font-normal text-white/85 mt-0.5 tabular-nums">
                        +{exercise.pointsValue} {t.workspace.points}
                      </div>
                    </div>
                  </button>

                  {/* Red Fail Button */}
                  <button
                    onClick={handleFailClick}
                    className="min-h-[52px] py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-red-950/50 active:scale-[0.99]"
                  >
                    <XCircle className="w-5 h-5 text-white shrink-0" />
                    <div className="text-left">
                      <div className="text-xs font-bold leading-none">{t.workspace.iStruggled}</div>
                      <div className="text-[10px] font-normal text-white/85 mt-0.5">
                        {t.workspace.showSolvingSequences}
                      </div>
                    </div>
                  </button>

                </div>
              </div>
            )}

            {/* Outcome Confirmed State */}
            {outcome === 'success' && (
              <div className="p-4 sm:p-5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-center space-y-3">
                <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-semibold text-sm">
                  <Check className="w-4 h-4" />
                  <span>{t.workspace.verifiedCorrect}</span>
                </div>
                <p className="text-xs text-white/60">
                  {t.workspace.verifiedDesc}
                </p>
                <div className="pt-1 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                  <button
                    onClick={() => {
                      setShowSequences(!showSequences);
                      setStepIndex(0);
                    }}
                    className="w-full sm:w-auto min-h-[40px] px-4 py-2 rounded-lg border border-white/20 text-xs text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {showSequences ? t.workspace.hideSequences : t.workspace.inspectDerivation}
                  </button>

                  {hasNext && onNextExercise && (
                    <button
                      onClick={onNextExercise}
                      className="w-full sm:w-auto min-h-[40px] px-4 py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors inline-flex items-center justify-center gap-1.5"
                    >
                      <span>{t.workspace.nextProblem}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {outcome === 'failed' && (
              <div className="p-4 sm:p-5 rounded-xl bg-red-950/30 border border-red-500/30 text-center space-y-2.5">
                <div className="flex items-center justify-center gap-1.5 text-red-400 font-semibold text-sm">
                  <XCircle className="w-4 h-4" />
                  <span>{t.workspace.trialRecorded}</span>
                </div>
                <p className="text-xs text-white/60">
                  {t.workspace.trialRecordedDesc}
                </p>
                {hasNext && onNextExercise && (
                  <div className="pt-1">
                    <button
                      onClick={onNextExercise}
                      className="w-full sm:w-auto min-h-[40px] px-4 py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors inline-flex items-center justify-center gap-1.5"
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

      {/* Exhaustive Step-by-Step Sequences of Solving (Button-Paginated so no scrolling required) */}
      {showSequences && steps.length > 0 && (
        <div className="p-4 sm:p-6 lg:p-8 rounded-2xl bg-neutral-950 border border-white/20 space-y-4 sm:space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-red-400 font-semibold">
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
                onClick={() => setViewAllSteps((v) => !v)}
                className="min-h-[36px] px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/15 text-xs font-medium text-white/85 flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <Layers className="w-3.5 h-3.5 text-white/70" />
                <span>{viewAllSteps ? t.workspace.stepByStepMode : t.workspace.allStepsMode}</span>
              </button>
            </div>
          </div>

          {!viewAllSteps ? (
            <div className="space-y-4">
              {/* Step Number Selector Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {steps.map((s, idx) => (
                    <button
                      key={s.stepNumber}
                      onClick={() => setStepIndex(idx)}
                      className={`min-h-[38px] min-w-[38px] px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border transition-all ${
                        idx === stepIndex
                          ? 'bg-white text-black border-white'
                          : 'bg-black text-white/60 border-white/15 hover:text-white hover:border-white/30'
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

              {/* Active Step Card */}
              <div className="p-4 sm:p-5 rounded-xl bg-black border border-white/15 space-y-3 relative overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-white/10 text-white font-bold">
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

                <div className="text-sm sm:text-base text-white/95 py-2.5 px-3 rounded-lg bg-neutral-950 border border-white/10">
                  <MathJaxRenderer math={activeStep.latexContent} />
                </div>

                <p className="text-xs sm:text-sm text-white/75 leading-relaxed pt-1">
                  {activeStep.explanation}
                </p>
              </div>

              {/* Step Previous / Next Buttons */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
                  disabled={stepIndex === 0}
                  className="min-h-[42px] px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:opacity-35 disabled:pointer-events-none border border-white/15 text-xs font-medium text-white flex items-center gap-1.5 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{t.workspace.prevStep}</span>
                </button>

                <button
                  onClick={() => setStepIndex((i) => Math.min(steps.length - 1, i + 1))}
                  disabled={stepIndex >= steps.length - 1}
                  className="min-h-[42px] px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 disabled:opacity-35 disabled:pointer-events-none text-xs font-semibold text-black flex items-center gap-1.5 transition-all"
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
                  className="p-4 sm:p-5 rounded-xl bg-black border border-white/15 space-y-3 relative overflow-hidden"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-white/10 text-white font-bold">
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

                  <div className="text-sm sm:text-base text-white/95 py-2.5 px-3 rounded-lg bg-neutral-950 border border-white/10">
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

      {/* Bottom Problem Navigation Bar (Button-Driven Traversal) */}
      {(hasPrevious || hasNext) && (
        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            onClick={onPreviousExercise}
            disabled={!hasPrevious || !onPreviousExercise}
            className="min-h-[42px] px-4 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-900 disabled:opacity-30 disabled:pointer-events-none border border-white/15 text-xs font-medium text-white flex items-center gap-1.5 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.workspace.prevProblem}</span>
          </button>

          <button
            onClick={onNextExercise}
            disabled={!hasNext || !onNextExercise}
            className="min-h-[42px] px-4 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-900 disabled:opacity-30 disabled:pointer-events-none border border-white/15 text-xs font-medium text-white flex items-center gap-1.5 transition-all"
          >
            <span>{t.workspace.nextProblem}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
};
