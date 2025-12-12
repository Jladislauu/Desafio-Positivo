// src/context/RubricContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Rubric, Criterion, Level, RubricType } from '../types/rubric.types';

interface RubricContextType {
  rubric: Rubric;
  updateRubric: (updates: Partial<Rubric>) => void;
  resetRubric: () => void;

  // Critérios
  addCriterion: () => void;
  removeCriterion: (id: string) => void;
  updateCriterion: (id: string, updates: Partial<Criterion>) => void;
  moveCriterion: (dragIndex: number, hoverIndex: number) => void;

  // Níveis globais (modo fixed)
  addGlobalLevel: () => void;
  removeGlobalLevel: (index: number) => void;
  updateGlobalLevel: (index: number, updates: Partial<{ label: string; points: number }>) => void;

  // Níveis por critério (modo variable) - já preparado para o futuro
  addLevelToCriterion: (criterionId: string) => void;
  removeLevelFromCriterion: (criterionId: string, levelIndex: number) => void;
  updateLevelInCriterion: (criterionId: string, levelIndex: number, updates: Partial<Level>) => void;
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
  ],
  globalLevels: [{ label: 'Atende expectativas', points: 4 }]
};

export const RubricProvider = ({ children }: { children: ReactNode }) => {
  const [rubric, setRubric] = useState<Rubric>(initialRubric);

  const updateRubric = (updates: Partial<Rubric>) => {
    setRubric(prev => ({ ...prev, ...updates }));
  };

  const resetRubric = () => setRubric(initialRubric);

  // === CRITÉRIOS ===
  const addCriterion = () => {
    const newCrit: Criterion = {
      id: uuidv4(),
      name: `Critério ${rubric.criteria.length + 1}`,
      order: rubric.criteria.length,
      levels: rubric.type === 'fixed' && rubric.globalLevels
        ? rubric.globalLevels.map(gl => ({ points: gl.points, description: '' }))
        : [{ points: 4, description: '' }]
    };
    setRubric(prev => ({ ...prev, criteria: [...prev.criteria, newCrit] }));
  };

  const removeCriterion = (id: string) => {
    setRubric(prev => ({
      ...prev,
      criteria: prev.criteria.filter(c => c.id !== id)
    }));
  };

  const updateCriterion = (id: string, updates: Partial<Criterion>) => {
    setRubric(prev => ({
      ...prev,
      criteria: prev.criteria.map(c => c.id === id ? { ...c, ...updates } : c)
    }));
  };

  const moveCriterion = (dragIndex: number, hoverIndex: number) => {
    setRubric(prev => {
      const newCriteria = [...prev.criteria];
      const [moved] = newCriteria.splice(dragIndex, 1);
      newCriteria.splice(hoverIndex, 0, moved);
      newCriteria.forEach((c, i) => c.order = i);
      return { ...prev, criteria: newCriteria };
    });
  };

  // === NÍVEIS GLOBAIS (FIXED) ===
  const addGlobalLevel = () => {
    const newLevel = { label: 'Novo nível', points: 0 };
    setRubric(prev => ({
      ...prev,
      globalLevels: [...(prev.globalLevels || []), newLevel],
      criteria: prev.criteria.map(c => ({
        ...c,
        levels: [...c.levels, { points: newLevel.points, description: '' }]
      }))
    }));
  };

  const removeGlobalLevel = (index: number) => {
    if ((rubric.globalLevels?.length || 0) <= 1) return;
    setRubric(prev => ({
      ...prev,
      globalLevels: prev.globalLevels?.filter((_, i) => i !== index),
      criteria: prev.criteria.map(c => ({
        ...c,
        levels: c.levels.filter((_, i) => i !== index)
      }))
    }));
  };

  const updateGlobalLevel = (index: number, updates: Partial<{ label: string; points: number }>) => {
    setRubric(prev => {
      const newGlobals = [...(prev.globalLevels || [])];
      newGlobals[index] = { ...newGlobals[index], ...updates };

      const newCriteria = prev.criteria.map(c => {
        const newLevels = [...c.levels];
        if (updates.points !== undefined) {
          newLevels[index].points = updates.points;
        }
        return { ...c, levels: newLevels };
      });

      return { ...prev, globalLevels: newGlobals, criteria: newCriteria };
    });
  };

  // === NÍVEIS POR CRITÉRIO (VARIABLE) - já preparado ===
  const addLevelToCriterion = (criterionId: string) => {
    setRubric(prev => ({
      ...prev,
      criteria: prev.criteria.map(c =>
        c.id === criterionId
          ? { ...c, levels: [...c.levels, { points: 0, description: '' }] }
          : c
      )
    }));
  };

  const removeLevelFromCriterion = (criterionId: string, levelIndex: number) => {
    setRubric(prev => {
      const crit = prev.criteria.find(c => c.id === criterionId);
      if (!crit || crit.levels.length <= 1) return prev;
      return {
        ...prev,
        criteria: prev.criteria.map(c =>
          c.id === criterionId
            ? { ...c, levels: c.levels.filter((_, i) => i !== levelIndex) }
            : c
        )
      };
    });
  };

  const updateLevelInCriterion = (criterionId: string, levelIndex: number, updates: Partial<Level>) => {
    setRubric(prev => ({
      ...prev,
      criteria: prev.criteria.map(c =>
        c.id === criterionId
          ? {
              ...c,
              levels: c.levels.map((l, i) => i === levelIndex ? { ...l, ...updates } : l)
            }
          : c
      )
    }));
  };

  const value: RubricContextType = {
    rubric,
    updateRubric,
    resetRubric,
    addCriterion,
    removeCriterion,
    updateCriterion,
    moveCriterion,
    addGlobalLevel,
    removeGlobalLevel,
    updateGlobalLevel,
    addLevelToCriterion,
    removeLevelFromCriterion,
    updateLevelInCriterion,
  };

  return <RubricContext.Provider value={value}>{children}</RubricContext.Provider>;
};

export const useRubric = () => {
  const context = useContext(RubricContext);
  if (!context) throw new Error('useRubric deve ser usado dentro de RubricProvider');
  return context;
};