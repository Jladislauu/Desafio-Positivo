import { useRubric } from '../context/RubricContext';
import { Trash2 } from 'lucide-react';

interface Props {
  index: number;
}

export default function LevelHeaderCell({ index }: Props) {
  const { rubric, updateGlobalLevel, removeGlobalLevel, addGlobalLevel } = useRubric();
  const level = rubric.globalLevels?.[index];

  if (!level) return null;

  return (
    <th className="px-4 py-4 text-center">
      <div className="flex flex-col items-center gap-2">
        <input
          type="text"
          value={level.label}
          onChange={(e) => updateGlobalLevel(index, { label: e.target.value })}
          className="px-2 py-1 text-sm font-medium border border-gray-300 rounded text-center w-32"
        />
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={level.points}
            onChange={(e) => updateGlobalLevel(index, { points: Number(e.target.value) })}
            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center"
            min="0"
            step="0.1"
          />
          <span className="text-sm text-gray-600">pts</span>
          {rubric.globalLevels!.length > 1 && (
            <button onClick={() => removeGlobalLevel(index)} className="text-red-500 hover:text-red-700">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
        {index === rubric.globalLevels!.length - 1 && (
          <button
            onClick={addGlobalLevel}
            className="mt-2 text-xs text-blue-600 hover:text-blue-700 underline"
          >
            + Adicionar nível
          </button>
        )}
      </div>
    </th>
  );
}