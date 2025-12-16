import { useRubric } from '../context/RubricContext';
import { Trash2 } from 'lucide-react';

interface Props {
  index: number;
}

export default function LevelHeaderCell({ index }: Props) {
  const { rubric, updateGlobalLevel, removeGlobalLevel } = useRubric();
  const level = rubric.globalLevels?.[index];

  if (!level) return null;

  return (
    <div className="relative px-4 py-3 text-center font-medium text-gray-700 bg-gray-50">
      {rubric.globalLevels!.length > 1 && (
        <button 
          onClick={() => removeGlobalLevel(index)} 
          className="absolute -top-4 left-1/2 -translate-x-1/2 text-gray-500 hover:bg-gray-100 p-1 rounded-full transition"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
      <input
        type="number"
        value={level.points}
        onChange={(e) => updateGlobalLevel(index, { points: Number(e.target.value) })}
        className="w-16 text-center" /* Sem border via global */
        min="0"
        step="0.1"
      />
      <span className="ml-1 text-sm text-gray-600">pts</span>
    </div>
  );
}