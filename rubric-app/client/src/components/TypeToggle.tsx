import { useRubric } from '../context/RubricContext';

export default function TypeToggle() {
  const { rubric, updateRubric } = useRubric();

  const handleChange = (type: 'fixed' | 'variable') => {
    if (type === rubric.type) return;

    if (type === 'variable') {
      const newCriteria = rubric.criteria.map(c => ({
        ...c,
        levels: (rubric.globalLevels || []).map(gl => ({
          points: gl.points,
          description: c.levels.find(l => l.points === gl.points)?.description || ''
        }))
      }));

      updateRubric({ 
        type: 'variable' as const, 
        criteria: newCriteria, 
        globalLevels: undefined 
      });
    } else {
      const firstCriterionLevels = rubric.criteria[0]?.levels || [];
      const baseLevels = firstCriterionLevels.map(l => ({
        label: l.label || `Nível ${l.points} pts`,
        points: l.points
      }));

      const syncedCriteria = rubric.criteria.map(c => ({
        ...c,
        levels: baseLevels.map(bl => ({
          points: bl.points,
          description: c.levels.find(l => l.points === bl.points)?.description || ''
        }))
      }));

      updateRubric({ 
        type: 'fixed' as const, 
        criteria: syncedCriteria, 
        globalLevels: baseLevels 
      });
    }
  };

  return (
    <div className="mb-8">
      <span className="block text-sm font-medium text-gray-700 mb-3">Tipo</span>
      <div className="flex gap-4">
        <label className="flex items-center cursor-pointer">
          <input type="radio" name="type" checked={rubric.type === 'fixed'} onChange={() => handleChange('fixed')} className="sr-only" />
          <span className={`px-5 py-2.5 rounded-lg border-2 transition-all ${rubric.type === 'fixed' ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium' : 'border-gray-300 text-gray-600'}`}>
            Níveis fixos
          </span>
        </label>

        <label className="flex items-center cursor-pointer">
          <input type="radio" name="type" checked={rubric.type === 'variable'} onChange={() => handleChange('variable')} className="sr-only" />
          <span className={`px-5 py-2.5 rounded-lg border-2 transition-all ${rubric.type === 'variable' ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium' : 'border-gray-300 text-gray-600'}`}>
            Níveis variáveis
          </span>
        </label>
      </div>
    </div>
  );
}