// src/components/CriterionRowFixed.tsx
import { useRubric } from '../context/RubricContext';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface Props {
  criterion: any;
}

export default function CriterionRowFixed({ criterion }: Props) {
  const {
    rubric,
    updateCriterion,
    updateLevelInCriterion,
  } = useRubric();

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: criterion.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr ref={setNodeRef} style={style} className="bg-white hover:bg-gray-50">
      {/* Handle de arrastar */}
      <td className="w-10 px-1 py-3 border-b border-r border-gray-200 align-middle">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing flex justify-center">
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>
      </td>

      {/* Nome do critério */}
      <td className="w-[140px] px-2 py-3 border-b border-r border-gray-200 align-top">
        <input
          type="text"
          value={criterion.name}
          onChange={(e) => updateCriterion(criterion.id, { name: e.target.value })}
          placeholder="Nome do critério"
          className="w-full bg-transparent border-none outline-none text-gray-800"
        />
      </td>

      {/* Células de descrição por nível */}
      {rubric.globalLevels?.map((_, idx) => (
        <td key={idx} className="px-2 py-3 border-b border-r border-gray-200 align-top last:border-r-0">
          <textarea
            value={criterion.levels[idx]?.description || ''}
            onChange={(e) => updateLevelInCriterion(criterion.id, idx, { description: e.target.value })}
            placeholder="Descreva o desempenho..."
            className="w-full min-h-[60px] bg-transparent border-none outline-none resize-none text-gray-700 placeholder-gray-400"
            rows={2}
          />
        </td>
      ))}
    </tr>
  );
}
