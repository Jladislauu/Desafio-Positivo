// src/context/RubricContext.tsx
import { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Rubric, Criterion, Level, RubricType } from '../types/rubric.types';

interface RubricContextType {
  rubric: Rubric;
  updateRubric: (updates: Partial<Rubric>) => void;
  resetRubric: () => void;
  isInitial: boolean;

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
  name: 'Minha Rubrica',
  type: 'fixed',
  globalLevels: [
    { points: 4, label: '' },
    { points: 3.4, label: '' },
    { points: 3, label: '' },
    { points: 2.6, label: '' },
  ],
  criteria: [
    {
      id: uuidv4(),
      name: 'Critério 1',
      order: 0,
      levels: [
        { points: 4, description: 'Descrição' },
        { points: 3.4, description: 'Descrição' },
        { points: 3, description: 'Descrição' },
        { points: 2.6, description: 'Descrição' },
      ]
    }
  ],
};

export const RubricProvider = ({ children }: { children: ReactNode }) => {
  const [rubric, setRubric] = useState<Rubric>(initialRubric);

  const isInitial = useMemo(() => {
    if (rubric.name !== initialRubric.name) return false;
    if (rubric.type !== initialRubric.type) return false;
    if (rubric.criteria.length !== 1) return false;
    const crit = rubric.criteria[0];
    const initCrit = initialRubric.criteria[0];
    if (crit.name !== initCrit.name) return false;
    if (crit.levels.length !== 4) return false;
    if (rubric.globalLevels?.length !== 4) return false;
    const pointsMatch = rubric.globalLevels.every((gl, i) => gl.points === initialRubric.globalLevels![i].points && gl.label === '');
    const levelsMatch = crit.levels.every((l, i) => l.points === initCrit.levels[i].points && l.description === 'Descrição');
    return pointsMatch && levelsMatch;
  }, [rubric]);

  const updateRubric = (updates: Partial<Rubric>) => {
    setRubric((prev) => ({ ...prev, ...updates }));
  };

  const resetRubric = () => {
    setRubric({...initialRubric, criteria: [{...initialRubric.criteria[0], id: uuidv4()}] }); // Novo ID para evitar cache
  };

  const addCriterion = () => {
    const newCriterion: Criterion = {
      id: uuidv4(),
      name: `Critério ${rubric.criteria.length + 1}`,
      order: rubric.criteria.length,
      levels: rubric.type === 'fixed'
        ? (rubric.globalLevels || []).map((gl) => ({ points: gl.points, description: '' }))
        : [{ points: 0, description: '' }]
    };
    setRubric((prev) => ({
      ...prev,
      criteria: [...prev.criteria, newCriterion],
    }));
  };

  const removeCriterion = (id: string) => {
    setRubric((prev) => ({
      ...prev,
      criteria: prev.criteria.filter((c) => c.id !== id),
    }));
  };

  const updateCriterion = (id: string, updates: Partial<Criterion>) => {
    setRubric((prev) => ({
      ...prev,
      criteria: prev.criteria.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    }));
  };

  const moveCriterion = (dragIndex: number, hoverIndex: number) => {
    setRubric((prev) => {
      const newCriteria = [...prev.criteria];
      const [dragged] = newCriteria.splice(dragIndex, 1);
      newCriteria.splice(hoverIndex, 0, dragged);
      return { ...prev, criteria: newCriteria };
    });
  };

  const addGlobalLevel = () => {
    const newLevel = { points: 0, label: '' };
    setRubric((prev) => ({
      ...prev,
      globalLevels: [...(prev.globalLevels || []), newLevel],
      criteria: prev.criteria.map((c) => ({
        ...c,
        levels: [...c.levels, { points: 0, description: '' }],
      })),
    }));
  };

  const removeGlobalLevel = (index: number) => {
    setRubric((prev) => ({
      ...prev,
      globalLevels: prev.globalLevels?.filter((_, i) => i !== index),
      criteria: prev.criteria.map((c) => ({
        ...c,
        levels: c.levels.filter((_, i) => i !== index),
      })),
    }));
  };

  const updateGlobalLevel = (index: number, updates: Partial<{ label: string; points: number }>) => {
    setRubric((prev) => ({
      ...prev,
      globalLevels: prev.globalLevels?.map((l, i) =>
        i === index ? { ...l, ...updates } : l
      ),
      criteria: prev.criteria.map((c) => ({
        ...c,
        levels: c.levels.map((cl, ci) =>
          ci === index ? { ...cl, points: updates.points ?? cl.points } : cl
        ),
      })),
    }));
  };

  const addLevelToCriterion = (criterionId: string) => {
    setRubric((prev) => ({
      ...prev,
      criteria: prev.criteria.map((c) =>
        c.id === criterionId
          ? { ...c, levels: [...c.levels, { points: 0, description: '' }] }
          : c
      ),
    }));
  };

  const removeLevelFromCriterion = (criterionId: string, levelIndex: number) => {
    setRubric((prev) => {
      const crit = prev.criteria.find((c) => c.id === criterionId);
      if (!crit || crit.levels.length <= 1) return prev;
      return {
        ...prev,
        criteria: prev.criteria.map((c) =>
          c.id === criterionId
            ? { ...c, levels: c.levels.filter((_, i) => i !== levelIndex) }
            : c
        ),
      };
    });
  };

  const updateLevelInCriterion = (criterionId: string, levelIndex: number, updates: Partial<Level>) => {
    setRubric((prev) => ({
      ...prev,
      criteria: prev.criteria.map((c) =>
        c.id === criterionId
          ? {
              ...c,
              levels: c.levels.map((l, i) => (i === levelIndex ? { ...l, ...updates } : l)),
            }
          : c
      ),
    }));
  };

  const value: RubricContextType = {
    rubric,
    updateRubric,
    resetRubric,
    isInitial,
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