export type TrackSlug = 'numbers_structures' | 'analysis_vectors';

export type LevelSlug = 'basic' | 'advanced';

export interface Track {
  id: string;
  slug: TrackSlug;
  title: string;
  subtitle: string;
  description: string;
  orderIndex: number;
}

export interface SolvingStep {
  stepNumber: number;
  title: string;
  latexContent: string;
  explanation: string;
  keyRule?: string;
}

export interface Exercise {
  id: string;
  trackId: TrackSlug;
  level: LevelSlug;
  orderInLevel: number;
  title: string;
  topicTag: string;
  latexStatement: string;
  theoremContext?: string;
  targetSolution: string;
  solvingSequences: SolvingStep[];
  defaultMinutes: number;
}

export interface RankTier {
  rankNumber: 1 | 2 | 3 | 4 | 5;
  id: 'master' | 'fellow' | 'scholar' | 'apprentice' | 'initiate';
  name: string;
  criteria: string;
  shortRequirement: string;
}

export interface TrackProgress {
  trackSlug: TrackSlug;
  basicExercises: Exercise[];
  advancedExercises: Exercise[];
  basicSolvedCount: number;
  basicTotalCount: number;
  advancedSolvedCount: number;
  advancedTotalCount: number;
  isAdvancedUnlocked: boolean;
  missingBasicExercises: Exercise[];
}

export interface UserStats {
  solvedCount: number;
  totalProblems: number;
  verifiedCount: number;
  struggledCount: number;
  totalTrials: number;
  accuracyPercentage: number;
}
