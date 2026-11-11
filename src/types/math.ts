export type TopicSlug = 'calculus' | 'linear_algebra' | 'number_theory' | 'discrete_math';

export interface Topic {
  id: string;
  slug: TopicSlug;
  title: string;
  description: string;
  orderIndex: number;
  iconName: string;
}

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Olympiad';

export interface SolvingStep {
  stepNumber: number;
  title: string;
  latexContent: string;
  explanation: string;
  keyRule?: string;
}

export interface Exercise {
  id: string;
  topicId: TopicSlug;
  title: string;
  difficulty: Difficulty;
  latexStatement: string;
  theoremContext?: string;
  targetSolution: string;
  hints: string[];
  solvingSequences: SolvingStep[];
  pointsValue: number;
  unlockHourOffset?: number;
}

export interface HistoryLog {
  id: string;
  exerciseId: string;
  exerciseTitle: string;
  topicId: TopicSlug;
  outcome: 'success' | 'failed';
  pointsEarned: number;
  timeSpentSeconds: number;
  timestamp: string;
}

export interface UserStats {
  succeededCount: number;
  failedCount: number;
  totalAttempts: number;
  successPercentage: number;
  failurePercentage: number;
  totalPoints: number;
}
