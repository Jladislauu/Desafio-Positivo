// src/components/CriterionRowVariable.tsx
import { useRubric } from '../context/RubricContext';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Plus } from 'lucide-react';

interface Props {
  criterion: any;
}

export default function CriterionRowVariable({ criterion }: Props) {
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
    <div ref={setNodeRef} style={style} className="flex flex-col gap-1">
      {/* Linha de lixeiras de níveis - acima da tabela */}
      <div className="flex items-center">
        {/* Espaço para drag handle + coluna critério */}
        <div className="w-[180px] flex-shrink-0"></div>
        {/* Lixeiras dos níveis - distribuídas proporcionalmente (sem bordas laterais) */}
        <div className="flex-1 flex">
          {criterion.levels.map((_: any, idx: number) => (
            <div key={idx} className="flex-1 flex justify-center">
              <button
                onClick={() => removeLevelFromCriterion(criterion.id, idx)}
                disabled={criterion.levels.length <= 1}
                className={`p-0.5 rounded-full transition ${
                  criterion.levels.length <= 1
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200'
                }`}
                title={criterion.levels.length <= 1 ? 'Não é possível remover o último nível' : 'Remover nível'}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        {/* Espaço para coluna de ações */}
        <div className="w-12 flex-shrink-0"></div>
      </div>

      {/* Linha principal */}
      <div className="flex items-stretch">
        {/* Container unificado com borda única */}
        <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden flex">
          {/* Handle de arrastar */}
          <div className="flex items-center justify-center w-10 flex-shrink-0 bg-gray-50 border-r border-gray-200">
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
              <GripVertical className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Coluna do critério (largura fixa) */}
          <div className="w-[140px] flex-shrink-0 border-r border-gray-200">
            {/* Header */}
            <div className="px-3 py-2 font-medium text-gray-700 text-sm bg-gray-100">
              Critério
            </div>
            {/* Nome */}
            <div className="px-3 py-3 bg-white border-t border-gray-200">
              <input
                type="text"
                value={criterion.name}
                onChange={(e) => updateCriterion(criterion.id, { name: e.target.value })}
                placeholder="Nome"
                className="w-full bg-transparent border-none outline-none text-gray-800 text-sm"
              />
            </div>
          </div>

          {/* Área de níveis - cada coluna ocupa espaço proporcional com bordas verticais */}
          <div className="flex-1 flex overflow-x-auto divide-x divide-gray-200">
            {criterion.levels.map((level: any, idx: number) => (
              <div key={idx} className="flex-1 min-w-[120px]">
                {/* Header do nível com pontos */}
                <div className="px-3 py-2 bg-gray-100">
                  <div className="flex items-center justify-center gap-1">
                    <input
                      type="number"
                      value={level.points}
                      onChange={(e) => updateLevelInCriterion(criterion.id, idx, { points: Number(e.target.value) })}
                      placeholder="9.5"
                      className="w-12 text-center bg-transparent border-none outline-none text-sm font-medium placeholder-gray-400"
                      min="0"
                      step="0.1"
                    />
                    <span className="text-xs text-gray-500">pts</span>
                  </div>
                </div>
                {/* Descrição do nível */}
                <div className="px-3 py-3 bg-white border-t border-gray-200">
                  <textarea
                    value={level.description || ''}
                    onChange={(e) => updateLevelInCriterion(criterion.id, idx, { description: e.target.value })}
                    placeholder="Descrição"
                    className="w-full min-h-[50px] bg-transparent border-none outline-none resize-none text-sm text-gray-700 placeholder-gray-400"
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna de ações: + em cima, lixeira embaixo */}
        <div className="flex flex-col items-center justify-center gap-2 px-2 flex-shrink-0">
          <button
            onClick={() => addLevelToCriterion(criterion.id)}
            className="w-7 h-7 rounded-full border border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 flex items-center justify-center transition"
            title="Adicionar nível"
          >
            <Plus className="w-4 h-4 text-gray-500 hover:text-blue-600" />
          </button>
          <button
            onClick={() => removeCriterion(criterion.id)}
            disabled={rubric.criteria.length <= 1}
            className={`p-1 rounded-full transition ${
              rubric.criteria.length <= 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-400 hover:text-red-500 hover:bg-gray-100'
            }`}
            title={rubric.criteria.length <= 1 ? 'Não é possível remover o último critério' : 'Remover critério'}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
