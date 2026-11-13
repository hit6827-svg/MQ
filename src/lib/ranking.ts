import { Exercise, RankTier, TrackProgress, TrackSlug } from '../types/math.ts';
import { Language } from '../i18n/translations.ts';

export function getRankLadder(lang: Language): RankTier[] {
  if (lang === 'fr') {
    return [
      {
        rankNumber: 1,
        id: 'master',
        name: 'Maître',
        criteria:
          'Résoudre les 12 problèmes de démonstration (Fondamental et Avancé complets dans les deux parcours).',
        shortRequirement: '12/12 problèmes résolus · 2 parcours complétés',
      },
      {
        rankNumber: 2,
        id: 'fellow',
        name: 'Lauréat',
        criteria:
          'Compléter le niveau Fondamental des deux parcours, débloquer les deux niveaux Avancés et résoudre au moins 9 problèmes dont 3 Avancés.',
        shortRequirement: 'Fondamental complet (×2) + 3 Avancés (9+ résolus)',
      },
      {
        rankNumber: 3,
        id: 'scholar',
        name: 'Érudit',
        criteria:
          'Compléter tous les problèmes Fondamentaux d’au moins un parcours (débloquant son niveau Avancé) et résoudre au moins 4 problèmes au total.',
        shortRequirement: '1 parcours Fondamental complet + 4+ résolus',
      },
      {
        rankNumber: 4,
        id: 'apprentice',
        name: 'Apprenti',
        criteria:
          'Résoudre au moins 2 problèmes Fondamentaux avec vérification de preuve.',
        shortRequirement: '2+ problèmes Fondamentaux résolus',
      },
      {
        rankNumber: 5,
        id: 'initiate',
        name: 'Initié',
        criteria:
          'Rang de départ (0 à 1 problème résolu). Commencez par les démonstrations du niveau Fondamental.',
        shortRequirement: 'Rang de départ',
      },
    ];
  }

  return [
    {
      rankNumber: 1,
      id: 'master',
      name: 'Master',
      criteria:
        'Solve all 12 curated proof problems across both tracks (100% Basic and 100% Advanced mastery).',
      shortRequirement: '12/12 proofs solved · Both tracks complete',
    },
    {
      rankNumber: 2,
      id: 'fellow',
      name: 'Fellow',
      criteria:
        'Complete Basic in both tracks (unlocking both Advanced tiers) and solve at least 9 problems including 3 Advanced.',
      shortRequirement: 'Both Basic tiers + 3 Advanced (9+ solved)',
    },
    {
      rankNumber: 3,
      id: 'scholar',
      name: 'Scholar',
      criteria:
        'Complete all Basic problems in at least one track (unlocking its Advanced level) and solve at least 4 problems total.',
      shortRequirement: '1 Basic tier complete + 4+ proofs solved',
    },
    {
      rankNumber: 4,
      id: 'apprentice',
      name: 'Apprentice',
      criteria:
        'Verify at least 2 proof-based solutions from the Basic level of either track.',
      shortRequirement: '2+ Basic proofs solved',
    },
    {
      rankNumber: 5,
      id: 'initiate',
      name: 'Initiate',
      criteria:
        'Starting rank (0–1 proofs solved). Begin with the Basic calculus and linear algebra proofs in either track.',
      shortRequirement: 'Starting rank',
    },
  ];
}

export function computeTrackProgress(
  trackSlug: TrackSlug,
  exercises: Exercise[],
  solvedIds: Set<string>
): TrackProgress {
  const trackExercises = exercises.filter((e) => e.trackId === trackSlug);
  const basicExercises = trackExercises
    .filter((e) => e.level === 'basic')
    .sort((a, b) => a.orderInLevel - b.orderInLevel);
  const advancedExercises = trackExercises
    .filter((e) => e.level === 'advanced')
    .sort((a, b) => a.orderInLevel - b.orderInLevel);

  const basicSolvedCount = basicExercises.filter((e) => solvedIds.has(e.id)).length;
  const advancedSolvedCount = advancedExercises.filter((e) => solvedIds.has(e.id)).length;
  const missingBasicExercises = basicExercises.filter((e) => !solvedIds.has(e.id));
  const isAdvancedUnlocked = basicExercises.length > 0 && missingBasicExercises.length === 0;

  return {
    trackSlug,
    basicExercises,
    advancedExercises,
    basicSolvedCount,
    basicTotalCount: basicExercises.length,
    advancedSolvedCount,
    advancedTotalCount: advancedExercises.length,
    isAdvancedUnlocked,
    missingBasicExercises,
  };
}

export interface RankEvaluation {
  currentRank: RankTier;
  nextRank: RankTier | null;
  ladder: RankTier[];
  solvedCount: number;
  totalProblems: number;
  basicSolvedCount: number;
  advancedSolvedCount: number;
  tracksBasicCompleteCount: number;
  overallProgressPercent: number;
  nextRankChecklist: { label: string; met: boolean }[];
}

export function evaluateRankProgression(
  exercises: Exercise[],
  solvedExerciseIds: string[],
  lang: Language
): RankEvaluation {
  const solvedSet = new Set(solvedExerciseIds);
  const ladder = getRankLadder(lang);

  const nsProgress = computeTrackProgress('numbers_structures', exercises, solvedSet);
  const avProgress = computeTrackProgress('analysis_vectors', exercises, solvedSet);

  const totalProblems = exercises.length;
  const solvedCount = exercises.filter((e) => solvedSet.has(e.id)).length;
  const basicSolvedCount = nsProgress.basicSolvedCount + avProgress.basicSolvedCount;
  const advancedSolvedCount = nsProgress.advancedSolvedCount + avProgress.advancedSolvedCount;
  const tracksBasicCompleteCount =
    (nsProgress.isAdvancedUnlocked ? 1 : 0) + (avProgress.isAdvancedUnlocked ? 1 : 0);

  let currentRankId: RankTier['id'] = 'initiate';

  if (solvedCount >= totalProblems && totalProblems > 0) {
    currentRankId = 'master';
  } else if (tracksBasicCompleteCount === 2 && advancedSolvedCount >= 3 && solvedCount >= 9) {
    currentRankId = 'fellow';
  } else if (tracksBasicCompleteCount >= 1 && solvedCount >= 4) {
    currentRankId = 'scholar';
  } else if (basicSolvedCount >= 2) {
    currentRankId = 'apprentice';
  }

  const currentRank = ladder.find((r) => r.id === currentRankId) || ladder[ladder.length - 1];
  const currentIdx = ladder.findIndex((r) => r.id === currentRank.id);
  const nextRank = currentIdx > 0 ? ladder[currentIdx - 1] : null;

  const nextRankChecklist: { label: string; met: boolean }[] = [];
  if (nextRank) {
    if (nextRank.id === 'apprentice') {
      nextRankChecklist.push({
        label:
          lang === 'fr'
            ? `Résoudre 2 problèmes Fondamentaux (${Math.min(basicSolvedCount, 2)}/2)`
            : `Solve 2 Basic proofs (${Math.min(basicSolvedCount, 2)}/2)`,
        met: basicSolvedCount >= 2,
      });
    } else if (nextRank.id === 'scholar') {
      nextRankChecklist.push({
        label:
          lang === 'fr'
            ? `Compléter le niveau Fondamental d’1 parcours (${tracksBasicCompleteCount}/1)`
            : `Complete 1 track's Basic level (${tracksBasicCompleteCount}/1)`,
        met: tracksBasicCompleteCount >= 1,
      });
      nextRankChecklist.push({
        label:
          lang === 'fr'
            ? `Résoudre au moins 4 problèmes au total (${Math.min(solvedCount, 4)}/4)`
            : `Solve at least 4 total proofs (${Math.min(solvedCount, 4)}/4)`,
        met: solvedCount >= 4,
      });
    } else if (nextRank.id === 'fellow') {
      nextRankChecklist.push({
        label:
          lang === 'fr'
            ? `Compléter le niveau Fondamental des 2 parcours (${tracksBasicCompleteCount}/2)`
            : `Complete Basic in both tracks (${tracksBasicCompleteCount}/2)`,
        met: tracksBasicCompleteCount === 2,
      });
      nextRankChecklist.push({
        label:
          lang === 'fr'
            ? `Résoudre au moins 3 problèmes Avancés (${Math.min(advancedSolvedCount, 3)}/3)`
            : `Solve at least 3 Advanced proofs (${Math.min(advancedSolvedCount, 3)}/3)`,
        met: advancedSolvedCount >= 3,
      });
      nextRankChecklist.push({
        label:
          lang === 'fr'
            ? `Résoudre au moins 9 problèmes au total (${Math.min(solvedCount, 9)}/9)`
            : `Solve at least 9 total proofs (${Math.min(solvedCount, 9)}/9)`,
        met: solvedCount >= 9,
      });
    } else if (nextRank.id === 'master') {
      nextRankChecklist.push({
        label:
          lang === 'fr'
            ? `Résoudre les ${totalProblems} problèmes (${solvedCount}/${totalProblems})`
            : `Solve all ${totalProblems} proofs (${solvedCount}/${totalProblems})`,
        met: solvedCount >= totalProblems,
      });
    }
  }

  return {
    currentRank,
    nextRank,
    ladder,
    solvedCount,
    totalProblems,
    basicSolvedCount,
    advancedSolvedCount,
    tracksBasicCompleteCount,
    overallProgressPercent: totalProblems > 0 ? (solvedCount / totalProblems) * 100 : 0,
    nextRankChecklist,
  };
}
