import React, { useState, useEffect } from 'react';
import { Exercise } from '../types/math.ts';
import { MathJaxRenderer } from './MathJaxRenderer.tsx';
import confetti from 'canvas-confetti';
import {
  Eye,
  CheckCircle2,
  XCircle,
  ArrowRight,
  BookOpen,
  Check,
} from 'lucide-react';

interface SolvingDeckProps {
  exercise: Exercise;
  onSuccess: (timeSpent: number) => void;
  onFail: (timeSpent: number) => void;
  onNextExercise?: () => void;
  hasNext: boolean;
}

export const SolvingDeck: React.FC<SolvingDeckProps> = ({
  exercise,
  onSuccess,
  onFail,
  onNextExercise,
  hasNext,
}) => {
  // Solution reveal & outcome state
  const [isSolutionRevealed, setIsSolutionRevealed] = useState(false);
  const [outcome, setOutcome] = useState<'idle' | 'success' | 'failed'>('idle');
  const [showSequences, setShowSequences] = useState(false);

  // Reset states when exercise changes
  useEffect(() => {
    setIsSolutionRevealed(false);
    setOutcome('idle');
    setShowSequences(false);
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
    onFail(0);
  };

  return (
    <div className="space-y-6">
      
      {/* Exercise Main Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-neutral-950 border border-white/15 shadow-xl relative overflow-hidden">
        
        {/* Category & Difficulty metadata */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10 font-mono text-xs">
          <div className="flex items-center gap-2 text-white/50">
            <span className="text-white font-semibold">{exercise.title}</span>
            <span aria-hidden="true">·</span>
            <span>{exercise.difficulty}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-semibold">{exercise.pointsValue} Points</span>
          </div>
        </div>

        {/* MathJax Problem Statement */}
        <div className="py-6">
          <span className="text-xs uppercase tracking-wider text-white/40 font-semibold block mb-2 font-mono">
            Problem Statement
          </span>
          <div className="text-lg md:text-xl font-medium text-white leading-relaxed">
            <MathJaxRenderer math={exercise.latexStatement} />
          </div>

          {exercise.theoremContext && (
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-white/60">
              <BookOpen className="w-4 h-4 text-white/50 shrink-0" />
              <span>Context & Invariant: <strong className="text-white font-medium">{exercise.theoremContext}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Self-Verification & Outcome Deck */}
      <div className="p-6 md:p-8 rounded-2xl bg-neutral-950 border border-white/15 space-y-6">
        <div>
          <h3 className="text-base font-bold text-white">Self-Verification & Target Solution</h3>
          <p className="text-xs text-white/50 mt-0.5">
            Work through the problem on paper. When you have calculated your final result, reveal the benchmark solution to evaluate.
          </p>
        </div>

        {/* Reveal Benchmark Solution Action */}
        {!isSolutionRevealed ? (
          <div className="p-6 rounded-xl bg-neutral-900/60 border border-white/10 text-center space-y-4">
            <p className="text-xs text-white/70 max-w-md mx-auto">
              Ready to verify? Click below to check your answer against the benchmark solution.
            </p>
            <button
              onClick={() => setIsSolutionRevealed(true)}
              className="py-3 px-6 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs inline-flex items-center gap-2 transition-all shadow-md hover:scale-[1.01] active:scale-[0.99]"
            >
              <Eye className="w-4 h-4" />
              <span>Reveal Target Solution</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Benchmark Solution Box */}
            <div className="p-5 rounded-xl bg-black border border-white/20">
              <span className="text-[11px] uppercase tracking-wider text-white/50 font-semibold block mb-2 font-mono">
                Benchmark Solution
              </span>
              <div className="text-lg text-white font-medium py-1">
                <MathJaxRenderer math={exercise.targetSolution} />
              </div>
            </div>

            {/* Outcome Gate Instructions & Actions */}
            {outcome === 'idle' && (
              <div className="space-y-3 pt-2 border-t border-white/10">
                <span className="text-xs text-white/70 block font-medium">
                  Did you reach the correct solution?
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Green Success Button */}
                  <button
                    onClick={handleSuccessClick}
                    className="py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-emerald-950/50 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                    <div className="text-left">
                      <div className="text-xs font-bold leading-none">I Succeeded!</div>
                      <div className="text-[10px] font-normal text-white/85 mt-0.5">+{exercise.pointsValue} Points</div>
                    </div>
                  </button>

                  {/* Red Fail Button */}
                  <button
                    onClick={handleFailClick}
                    className="py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-red-950/50 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <XCircle className="w-5 h-5 text-white shrink-0" />
                    <div className="text-left">
                      <div className="text-xs font-bold leading-none">I Struggled / Failed</div>
                      <div className="text-[10px] font-normal text-white/85 mt-0.5">Show Solving Sequences</div>
                    </div>
                  </button>

                </div>
              </div>
            )}

            {/* Outcome Confirmed State */}
            {outcome === 'success' && (
              <div className="p-5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-center space-y-3">
                <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-semibold text-sm">
                  <Check className="w-4 h-4" />
                  <span>Verified Correct · Points Awarded!</span>
                </div>
                <p className="text-xs text-white/60">
                  Great job. Attempt verified and logged to History.
                </p>
                <div className="pt-1 flex flex-wrap items-center justify-center gap-4">
                  <button
                    onClick={() => setShowSequences(!showSequences)}
                    className="text-xs text-white/70 hover:text-white underline underline-offset-4 transition-colors"
                  >
                    {showSequences ? 'Hide Solving Sequences' : 'Inspect Step-by-Step Derivation'}
                  </button>

                  {hasNext && onNextExercise && (
                    <button
                      onClick={onNextExercise}
                      className="px-4 py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>Next Problem</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {outcome === 'failed' && (
              <div className="p-5 rounded-xl bg-red-950/30 border border-red-500/30 text-center space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-red-400 font-semibold text-sm">
                  <XCircle className="w-4 h-4" />
                  <span>Trial Recorded · Derivation Unfolded Below</span>
                </div>
                <p className="text-xs text-white/60">
                  Study the step-by-step solving sequences below to master the core transformation rules.
                </p>
                {hasNext && onNextExercise && (
                  <div className="pt-2">
                    <button
                      onClick={onNextExercise}
                      className="px-4 py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>Proceed to Next Problem</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        )}
      </div>

      {/* Exhaustive Step-by-Step Sequences of Solving (unfolded on Red Fail or toggle) */}
      {showSequences && (
        <div className="p-6 md:p-8 rounded-2xl bg-neutral-950 border border-white/20 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-red-400 font-semibold">
                Pedagogical Sequences of Solving
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Full Step-by-Step Mathematical Derivation
              </h3>
            </div>
            <span className="text-xs font-mono text-white/50">
              {exercise.solvingSequences.length} Sequential Steps
            </span>
          </div>

          <div className="space-y-4">
            {exercise.solvingSequences.map((step) => (
              <div
                key={step.stepNumber}
                className="p-5 rounded-xl bg-black border border-white/15 space-y-3 relative overflow-hidden"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-white/10 text-white font-bold">
                      Step {step.stepNumber}
                    </span>
                    <span className="text-white font-semibold">{step.title}</span>
                  </div>

                  {step.keyRule && (
                    <span className="text-white/50 text-[11px] italic">
                      Invariant: {step.keyRule}
                    </span>
                  )}
                </div>

                {/* MathJax Derivation line */}
                <div className="text-base text-white/95 py-2 pl-2 border-l-2 border-white/20">
                  <MathJaxRenderer math={step.latexContent} />
                </div>

                {/* Plain-English Mathematical Rationale */}
                <p className="text-xs text-white/70 leading-relaxed pt-2 border-t border-white/5">
                  {step.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
