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
  const { rubric, addCriterion, moveCriterion, addGlobalLevel } = useRubric();

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
  const levelCount = rubric.type === 'fixed' ? rubric.globalLevels?.length || 0 : 0; // Para colunas fixed

  return (
    <div className="relative mt-6">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div 
          className="grid gap-0 border-collapse"
          style={{ 
            gridTemplateColumns: `min-content 200px repeat(${rubric.type === 'fixed' ? levelCount : 'auto'}, minmax(150px, 1fr)) min-content`
          }}
        >
          {/* Header Row */}
          <div className="contents">
            <div className="px-4 py-3 bg-gray-50"></div> {/* Drag empty */}
            <div className="px-4 py-3 text-left font-medium text-gray-700 bg-gray-50">Critério</div>
            {rubric.type === 'fixed' &&
              rubric.globalLevels?.map((_, i) => <LevelHeaderCell key={i} index={i} />)}
            {rubric.type === 'variable' && <div className="px-4 py-3 bg-gray-50"></div>} {/* Empty for + in rows */}
            <div className="px-4 py-3 bg-gray-50"></div> {/* Trash empty */}
          </div>

          {/* Body Rows */}
          <SortableContext items={criterionIds} strategy={verticalListSortingStrategy}>
            {rubric.criteria.map((criterion) => (
              <CriterionRow key={criterion.id} criterion={criterion} />
            ))}
          </SortableContext>
        </div>
      </DndContext>

      {/* Botão + para níveis globais (fixed), superior direito fora */}
      {rubric.type === 'fixed' && (
        <button
          onClick={addGlobalLevel}
          className="absolute top-[-16px] right-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition"
          title="Adicionar nível"
        >
          <Plus className="w-5 h-5" />
        </button>
      )}

      {/* Add Criterion bottom-left */}
      <button
        onClick={addCriterion}
        className="mt-4 text-blue-600 text-sm flex items-center"
      >
        <Plus className="w-4 h-4 mr-1" /> Adicionar critério
      </button>
    </div>
  );
}