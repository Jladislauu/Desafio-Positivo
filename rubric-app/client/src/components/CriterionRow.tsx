// src/components/CriterionRow.tsx
import { useRubric } from '../context/RubricContext';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Plus } from 'lucide-react';

interface Props {
  criterion: any;
}

export default function CriterionRow({ criterion }: Props) {
  const {
    rubric,
    updateCriterion,
    removeCriterion,
    addLevelToCriterion,
    removeLevelFromCriterion,
    updateLevelInCriterion,
  } = useRubric();

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: criterion.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const levels = rubric.type === 'fixed' ? rubric.globalLevels : criterion.levels;

  return (
    <div ref={setNodeRef} style={style} className="contents hover:bg-gray-50">
      <div className="px-4 py-3">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      <div className="px-4 py-3">
        <input
          type="text"
          value={criterion.name}
          onChange={(e) => updateCriterion(criterion.id, { name: e.target.value })}
          placeholder="Critério"
          className="w-full" /* Sem border */
        />
      </div>
      {levels?.map((level, idx) => (
        <div key={idx} className="relative px-4 py-3">
          {rubric.type === 'variable' && criterion.levels.length > 1 && (
            <button
              onClick={() => removeLevelFromCriterion(criterion.id, idx)}
              className="absolute -top-4 left-1/2 -translate-x-1/2 text-gray-500 hover:bg-gray-100 p-1 rounded-full transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          {rubric.type === 'variable' && (
            <div className="flex justify-center mb-2">
              <input
                type="number"
                value={level.points}
                onChange={(e) => updateLevelInCriterion(criterion.id, idx, { points: Number(e.target.value) })}
                className="w-16 text-center"
                min="0"
                step="0.1"
              />
              <span className="ml-1 text-sm text-gray-600">pts</span>
            </div>
          )}
          <textarea
            value={level.description || criterion.levels[idx]?.description}
            onChange={(e) => updateLevelInCriterion(criterion.id, idx, { description: e.target.value })}
            placeholder="Descreva o desempenho..."
            className="w-full"
          />
        </div>
      ))}
      {rubric.type === 'variable' &&
        Array.from({ length: Math.max(0, rubric.criteria.reduce((max, c) => Math.max(max, c.levels.length), 1) - criterion.levels.length) }).map((_, i) => (
          <div key={`filler-${criterion.id}-${i}`} className="px-4 py-3" />
        ))}
      {rubric.type === 'variable' && (
        <div className="px-4 py-3 align-top">
          <button
            onClick={() => addLevelToCriterion(criterion.id)}
            className="w-8 h-8 rounded-full border border-dashed border-gray-400 hover:border-blue-500 hover:text-blue-600 flex items-center justify-center transition"
            title="Adicionar nível"
          >
            <Plus className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      )}
      <div className="px-4 py-3 text-center">
        <button 
          onClick={() => removeCriterion(criterion.id)} 
          className="text-gray-500 hover:bg-gray-100 p-1 rounded-full transition"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}