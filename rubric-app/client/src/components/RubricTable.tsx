// src/components/RubricTable.tsx
import { useRubric } from '../context/RubricContext';
import CriterionRow from './CriterionRow';
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
import { Plus } from 'lucide-react';

export default function RubricTable() {
  const { rubric, addCriterion, moveCriterion } = useRubric();

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

  return (
    <div className="relative mt-8">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-300 bg-gray-50">
              <th className="w-12 px-4 py-4"></th>
              <th className="px-4 py-4 text-left font-medium text-gray-700">Critério</th>

              {rubric.type === 'fixed' &&
                rubric.globalLevels?.map((_, i) => <LevelHeaderCell key={i} index={i} />)}

              {rubric.type === 'variable' && <th className="px-4 py-4"></th>}

              <th className="w-20 px-4 py-4"></th>
            </tr>
          </thead>

          <tbody>
            <SortableContext items={criterionIds} strategy={verticalListSortingStrategy}>
              {rubric.criteria.map((criterion, index) => (
                <CriterionRow key={criterion.id} criterion={criterion} index={index} />
              ))}
            </SortableContext>
          </tbody>
        </table>
      </DndContext>

      {/* Botão + adicionado fora da tabela, pequeno e à direita */}
      <button
        onClick={addCriterion}
        className="absolute top-0 right-0 mt-[-12px] mr-[-12px] w-12 h-12 rounded-full bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center text-3xl shadow-lg transition"
        title="Adicionar critério"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}