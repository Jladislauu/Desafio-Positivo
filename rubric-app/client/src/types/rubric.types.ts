export type RubricType = 'fixed' | 'variable';

export interface Level {
  id?: string;
  label?: string;
  points: number;
  description: string;
}

export interface Criterion {
  id?: string;
  name: string;
  order: number;
  levels: Level[];
}

export interface Rubric {
  name: string;
  type: RubricType;
  criteria: Criterion[];
  globalLevels?: Array<{ label: string; points: number }>;
}