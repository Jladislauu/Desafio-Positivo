// src/components/CriterionRow.tsx
import { useRubric } from '../context/RubricContext';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Plus, X } from 'lucide-react';

interface Props {
  criterion: any;
  index: number;
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

  return (
    <tr ref={setNodeRef} style={style} className="border-b border-gray-200 hover:bg-gray-50">
      {/* Drag handle */}
      <td className="px-4 py-3">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>
      </td>

      {/* Nome do critério */}
      <td className="px-4 py-3 min-w-64">
        <input
          type="text"
          value={criterion.name}
          onChange={(e) => updateCriterion(criterion.id, { name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Nome do critério"
        />
      </td>

      {/* Células — MODO FIXED */}
      {rubric.type === 'fixed' &&
        criterion.levels.map((level: any, idx: number) => (
          <td key={idx} className="px-4 py-3 align-top w-80">
            <textarea
              value={level.description}
              onChange={(e) => {
                const newLevels = [...criterion.levels];
                newLevels[idx].description = e.target.value;
                updateCriterion(criterion.id, { levels: newLevels });
              }}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descreva o desempenho..."
            />
          </td>
        ))}

      {/* Células — MODO VARIABLE */}
      {rubric.type === 'variable' &&
        criterion.levels.map((level: any, idx: number) => (
          <td key={idx} className="px-4 py-3 align-top min-w-72">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="number"
                value={level.points}
                onChange={(e) => updateLevelInCriterion(criterion.id, idx, { points: Number(e.target.value) })}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                min="0"
                step="0.1"
              />
              <span className="text-sm text-gray-600">pts</span>
              {criterion.levels.length > 1 && (
                <button
                  onClick={() => removeLevelFromCriterion(criterion.id, idx)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <textarea
              value={level.description}
              onChange={(e) => updateLevelInCriterion(criterion.id, idx, { description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descreva o desempenho..."
            />
          </td>
        ))}

      {/* Botão + nível (só no modo variable) */}
      {rubric.type === 'variable' && (
        <td className="px-4 py-3 align-top">
          <button
            onClick={() => addLevelToCriterion(criterion.id)}
            className="w-9 h-9 rounded-full border-2 border-dashed border-gray-400 hover:border-blue-500 hover:text-blue-600 flex items-center justify-center transition"
            title="Adicionar nível"
          >
            <Plus className="w-5 h-5" />
          </button>
        </td>
      )}

      {/* Botão remover critério */}
      <td className="px-4 py-3 text-center">
        <button onClick={() => removeCriterion(criterion.id)} className="text-red-500 hover:text-red-700">
          <Trash2 className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
}