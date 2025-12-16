// src/components/RubricTable.tsx
import { useRubric } from '../context/RubricContext';
import CriterionRowFixed from './CriterionRowFixed';
import CriterionRowVariable from './CriterionRowVariable';
import LevelHeaderCell from './LevelHeaderCell';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { DragEndEvent } from '@dnd-kit/core';
import { Plus, Trash2 } from 'lucide-react';

export default function RubricTable() {
  const { rubric, addCriterion, removeCriterion, moveCriterion, addGlobalLevel, removeGlobalLevel } = useRubric();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = rubric.criteria.findIndex((c) => c.id === active.id);
    const newIndex = rubric.criteria.findIndex((c) => c.id === over.id);

    if (oldIndex !== newIndex) {
      moveCriterion(oldIndex, newIndex);
    }
  };

  const criterionIds = rubric.criteria.map((c) => c.id!);

  // Modo FIXED: tabela que se comprime, coluna de ações fora da tabela
  if (rubric.type === 'fixed') {
    return (
      <div className="mt-6">
        {/* Linha de lixeiras de níveis - acima da tabela */}
        <div className="flex items-center gap-2 mb-1">
          {/* Espaço para drag handle + coluna critério */}
          <div className="w-10"></div>
          <div className="w-[140px]"></div>
          {/* Lixeiras dos níveis */}
          <div className="flex-1 flex">
            <div className="w-full flex">
              {rubric.globalLevels?.map((_, i) => (
                <div key={i} className="flex-1 flex justify-center">
                  <button
                    onClick={() => removeGlobalLevel(i)}
                    disabled={(rubric.globalLevels?.length || 0) <= 1}
                    className={`p-1 rounded-full transition ${
                      (rubric.globalLevels?.length || 0) <= 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200'
                    }`}
                    title={(rubric.globalLevels?.length || 0) <= 1 ? 'Não é possível remover o último nível' : 'Remover nível'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* Espaço para coluna de ações */}
          <div className="w-10"></div>
        </div>

        {/* Container flex para tabela + coluna de ações */}
        <div className="flex items-stretch gap-2">
          {/* Tabela que se comprime horizontalmente */}
          <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full border-collapse table-fixed">
              {/* Header */}
              <thead>
                <tr className="bg-gray-100">
                  <th className="w-10 px-1 py-3 border-b border-r border-gray-200"></th>
                  <th className="w-[140px] px-3 py-3 text-left font-medium text-gray-700 border-b border-r border-gray-200">
                    Critério
                  </th>
                  {rubric.globalLevels?.map((_, i) => (
                    <LevelHeaderCell key={i} index={i} />
                  ))}
                </tr>
              </thead>
              {/* Body */}
              <tbody>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={criterionIds} strategy={verticalListSortingStrategy}>
                    {rubric.criteria.map((criterion) => (
                      <CriterionRowFixed key={criterion.id} criterion={criterion} />
                    ))}
                  </SortableContext>
                </DndContext>
              </tbody>
            </table>
          </div>

          {/* Coluna de ações: + no topo, lixeiras alinhadas com cada linha */}
          <div className="flex flex-col items-center">
            {/* Botão + para adicionar nível global */}
            <button
              onClick={addGlobalLevel}
              className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition shadow-md mb-2"
              title="Adicionar nível"
            >
              <Plus className="w-5 h-5" />
            </button>
            {/* Lixeiras para cada critério */}
            {rubric.criteria.map((criterion) => (
              <div key={criterion.id} className="h-[76px] flex items-center justify-center">
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
            ))}
          </div>
        </div>

        {/* Adicionar critério */}
        <button
          onClick={addCriterion}
          className="mt-4 text-blue-600 text-sm flex items-center hover:underline"
        >
          <Plus className="w-4 h-4 mr-1" /> Adicionar critério
        </button>
      </div>
    );
  }

  // Modo VARIABLE: cada linha com seu próprio scroll horizontal
  return (
    <div className="mt-6 space-y-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={criterionIds} strategy={verticalListSortingStrategy}>
          {rubric.criteria.map((criterion) => (
            <CriterionRowVariable key={criterion.id} criterion={criterion} />
          ))}
        </SortableContext>
      </DndContext>

      {/* Adicionar critério */}
      <button
        onClick={addCriterion}
        className="mt-4 text-blue-600 text-sm flex items-center hover:underline"
      >
        <Plus className="w-4 h-4 mr-1" /> Adicionar critério
      </button>
    </div>
  );
}