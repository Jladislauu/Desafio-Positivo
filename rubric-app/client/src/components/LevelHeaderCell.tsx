import { useRubric } from '../context/RubricContext';

interface Props {
  index: number;
}

export default function LevelHeaderCell({ index }: Props) {
  const { rubric, updateGlobalLevel } = useRubric();
  const level = rubric.globalLevels?.[index];

  if (!level) return null;

  return (
    <th className="relative px-2 py-3 text-center bg-gray-100 border-b border-r border-gray-200">
      {/* Rótulo do nível */}
      <input
        type="text"
        value={level.label ?? ''}
        onChange={(e) => updateGlobalLevel(index, { label: e.target.value })}
        placeholder="Rótulo do nível"
        className="w-full text-center font-medium text-gray-700 bg-transparent border-none outline-none placeholder-gray-400"
      />
      
      {/* Pontuação */}
      <div className="flex items-center justify-center text-sm text-gray-500 mt-1">
        <span>(</span>
        <input
          type="number"
          value={level.points}
          onChange={(e) => updateGlobalLevel(index, { points: Number(e.target.value) })}
          className="w-12 text-center bg-transparent border-none outline-none"
          min="0"
          step="0.1"
        />
        <span>pts)</span>
      </div>
    </th>
  );
}