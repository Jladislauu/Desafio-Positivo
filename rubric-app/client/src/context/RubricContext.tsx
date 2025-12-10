import { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Rubric, RubricType } from '../types/rubric.types';

interface RubricContextType {
  rubric: Rubric;
  updateRubric: (updates: Partial<Rubric>) => void;
  resetRubric: () => void;
}

const RubricContext = createContext<RubricContextType | undefined>(undefined);

const initialRubric: Rubric = {
  name: '',
  type: 'fixed',
  criteria: [
    {
      id: uuidv4(),
      name: 'Critério 1',
      order: 0,
      levels: [{ points: 4, description: '' }]
    }
  ]
};

export const RubricProvider = ({ children }: { children: ReactNode }) => {
  const [rubric, setRubric] = useState<Rubric>(initialRubric);

  const updateRubric = (updates: Partial<Rubric>) => {
    setRubric(prev => ({ ...prev, ...updates }));
  };

  const resetRubric = () => setRubric(initialRubric);

  return (
    <RubricContext.Provider value={{ rubric, updateRubric, resetRubric }}>
      {children}
    </RubricContext.Provider>
  );
};

export const useRubric = () => {
  const context = useContext(RubricContext);
  if (!context) throw new Error('useRubric must be used within RubricProvider');
  return context;
};