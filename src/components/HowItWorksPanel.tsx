import React from 'react';
import { RankEvaluation } from '../lib/ranking.ts';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import { X, Compass, Lock, Clock, Award, CheckCircle2 } from 'lucide-react';

interface HowItWorksPanelProps {
  onClose: () => void;
  rankEval: RankEvaluation;
}

export const HowItWorksPanel: React.FC<HowItWorksPanelProps> = ({ onClose, rankEval }) => {
  const { language, t } = useLanguage();

  const rules = [
    {
      icon: Compass,
      title: t.howItWorks.step1Title,
      desc: t.howItWorks.step1Desc,
    },
    {
      icon: Lock,
      title: t.howItWorks.step2Title,
      desc: t.howItWorks.step2Desc,
    },
    {
      icon: Clock,
      title: t.howItWorks.step3Title,
      desc: t.howItWorks.step3Desc,
    },
    {
      icon: Award,
      title: t.howItWorks.step4Title,
      desc: t.howItWorks.step4Desc,
    },
  ];

  // Display ladder bottom-to-top or top-to-bottom (Rank 1 Master first)
  const ladder = rankEval.ladder;

  return (
    <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-10 relative z-10 space-y-6">
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {language === 'fr'
              ? 'Méthodologie & Échelle des rangs'
              : 'Proof Methodology & Rank Ladder'}
          </h1>
          <p className="text-xs sm:text-sm text-white/55 mt-1">{t.howItWorks.subtitle}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="min-h-[40px] px-3 py-1.5 rounded-none bg-neutral-950/75 hover:bg-neutral-900 backdrop-blur-md border border-white/15 text-xs font-medium text-white/80 hover:text-white flex items-center gap-1.5 transition-colors shrink-0"
          aria-label={t.nav.closePanel}
        >
          <X className="w-4 h-4" />
          <span className="hidden sm:inline">{t.nav.backToPractice}</span>
        </button>
      </div>

      {/* 4 Core Mechanics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rules.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="p-4 sm:p-5 rounded-none bg-neutral-950/70 backdrop-blur-xl border border-white/15 space-y-2.5"
            >
              <div className="w-9 h-9 rounded-none bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-center">
                <Icon className="w-4 h-4 text-white/85" />
              </div>
              <h2 className="text-sm font-bold text-white">{item.title}</h2>
              <p className="text-xs text-white/65 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </section>

      {/* Full Rank 1 -> Rank 5 Ladder */}
      <section className="p-4 sm:p-6 rounded-none bg-neutral-950/70 backdrop-blur-xl border border-white/15 space-y-4">
        <h2 className="text-sm sm:text-base font-bold text-white pb-3 border-b border-white/10">
          {t.howItWorks.ladderTitle}
        </h2>

        <div className="space-y-2.5">
          {ladder.map((tier) => {
            const isCurrent = tier.rankNumber === rankEval.currentRank.rankNumber;
            const isAchieved = tier.rankNumber >= rankEval.currentRank.rankNumber;

            return (
              <div
                key={tier.id}
                className={`p-3.5 sm:p-4 rounded-none border backdrop-blur-md transition-colors ${
                  isCurrent
                    ? 'bg-white/15 border-white/45'
                    : isAchieved
                    ? 'bg-black/70 border-emerald-500/30'
                    : 'bg-black/55 border-white/10'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-none ${
                        tier.rankNumber === 1
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                          : 'bg-neutral-900/80 text-white/85 border border-white/15'
                      }`}
                    >
                      {t.howItWorks.rankPrefix} {tier.rankNumber}
                    </span>
                    <span className="text-sm font-bold text-white">{tier.name}</span>
                  </div>

                  {isCurrent && (
                    <span className="text-[11px] font-mono text-emerald-400 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t.performance.currentRankLabel}</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-white/65 mt-2 leading-relaxed">{tier.criteria}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};
