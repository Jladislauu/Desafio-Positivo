// client/src/components/RubricTable.tsx
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
    const newIndex = rubric.criteria.findIndex((c) => c.id === over.id); // ← AQUI ERA O ERRO

    if (oldIndex !== newIndex) {
      moveCriterion(oldIndex, newIndex);
    }
  };

  const criterionIds = rubric.criteria.map((c) => c.id!);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-300 bg-gray-50">
              <th className="w-12 px-4 py-4"></th>
              <th className="px-4 py-4 text-left font-medium text-gray-700">Critério</th>

              {/* Níveis fixos */}
              {rubric.type === 'fixed' &&
                rubric.globalLevels?.map((_, i) => <LevelHeaderCell key={i} index={i} />)}

              {/* Níveis variáveis — cabeçalho vazio (níveis ficam dentro da linha) */}
              {rubric.type === 'variable' && <th className="px-4 py-4"></th>}

              <th className="w-20 px-4 py-4">
                <button
                  onClick={addCriterion}
                  className="w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center text-2xl shadow-lg transition"
                >
                  +
                </button>
              </th>
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
    </div>
  );
}