// src/types/rubric.types.ts
export type RubricType = 'fixed' | 'variable';

export interface Level {
  id?: string;
  label?: string;           // usado apenas no modo fixed
  points: number;
  description: string;
}

export interface Criterion {
  id: string;               // obrigatório (uuid)
  name: string;
  order: number;
  levels: Level[];
}

export interface Rubric {
  name: string;
  type: RubricType;
  criteria: Criterion[];
  globalLevels?: Array<{
    label: string;
    points: number;
  }>;                       // apenas no modo fixed
}