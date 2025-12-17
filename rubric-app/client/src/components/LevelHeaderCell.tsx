import { useRubric } from '../context/RubricContext';
import { useState } from 'react';

interface Props {
  index: number;
}

export default function LevelHeaderCell({ index }: Props) {
  const { rubric, updateGlobalLevel } = useRubric();
  const level = rubric.globalLevels?.[index];
  const [editingPoints, setEditingPoints] = useState(false);
  const [editingLabel, setEditingLabel] = useState(false);

  if (!level) return null;

  // Placeholders alinhados ao CoGrader (em PT-BR)
  const labelPlaceholders = [
    'Ex: Atende expectativas',
    'Ex: Aproxima-se das expectativas',
    'Ex: Abaixo das expectativas',
    'Ex: Muito abaixo das expectativas',
  ];
  const pointsPlaceholders = ['Ex: 4', 'Ex: 3.4', 'Ex: 3', 'Ex: 2.6'];
  const labelPlaceholder = labelPlaceholders[index] ?? 'Ex: Nível';
  const pointsPlaceholder = pointsPlaceholders[index] ?? 'Ex: 3';
  const displayPoints =
    level.points === undefined || level.points === null ? pointsPlaceholder.replace('Ex: ', '') : String(level.points);

  // Sem lógica extra; usamos input number nativo com setas

  return (
    <th className="relative px-3 py-3 text-left bg-gray-100 border-b border-r border-gray-200">
      <div className="flex items-center justify-between gap-3">
        {/* Rótulo do nível à esquerda: wrap quando não está editando */}
        {!editingLabel ? (
          <button
            type="button"
            onClick={() => setEditingLabel(true)}
            className="flex-1 text-left"
            aria-label="Editar rótulo do nível"
          >
            <span className="font-semibold text-gray-900 break-words whitespace-normal leading-tight">
              {level.label && level.label.trim() !== '' ? level.label : labelPlaceholder}
            </span>
          </button>
        ) : (
          <textarea
            value={level.label ?? ''}
            onChange={(e) => updateGlobalLevel(index, { label: e.target.value })}
            onBlur={() => setEditingLabel(false)}
            placeholder={labelPlaceholder}
            rows={2}
            className="flex-1 font-semibold text-gray-900 bg-white border border-blue-400 rounded-md px-3 py-2 resize-none leading-tight placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}

        {/* Pontuação: mostra (4) quando idle; mostra input ao focar/clicar */}
        {!editingPoints ? (
          <button
            type="button"
            className="text-sm font-semibold text-gray-900"
            onClick={() => setEditingPoints(true)}
            aria-label="Editar pontuação"
          >
            (<span>{displayPoints}</span>)
          </button>
        ) : (
          <input
            type="number"
            autoFocus
            value={level.points ?? 0}
            onChange={(e) => updateGlobalLevel(index, { points: Number(e.target.value) })}
            onBlur={() => setEditingPoints(false)}
            placeholder={pointsPlaceholder}
            className="text-sm text-gray-900 bg-white border border-blue-400 rounded-md px-3 py-1 text-center mx-0 focus:outline-none focus:ring-2 focus:ring-blue-500 tabular-nums min-w-[72px] max-w-[160px]"
            min={0}
            step={0.1}
            style={{ width: `${Math.max(4, String(level.points ?? '').length + 2)}ch` }}
            aria-label="Editar pontuação do nível"
          />
        )}
      </div>
    </th>
  );
}