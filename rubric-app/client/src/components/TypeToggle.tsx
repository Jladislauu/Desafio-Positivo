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
    <div className="ml-8"> {/* Margem esquerda para alinhar ao lado do Name */}
      <span className="block text-sm font-medium text-gray-600 mb-1">Tipo</span>
      <div className="inline-flex rounded-md shadow-sm border border-gray-200" role="group">
        <button
          type="button"
          onClick={() => handleChange('fixed')}
          className={`px-4 py-2 text-sm font-medium transition-all ${
            rubric.type === 'fixed'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          } rounded-l-md border-r border-gray-200`}
        >
          Níveis fixos
        </button>
        <button
          type="button"
          onClick={() => handleChange('variable')}
          className={`px-4 py-2 text-sm font-medium transition-all ${
            rubric.type === 'variable'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          } rounded-r-md`}
        >
          Níveis variáveis
        </button>
      </div>
      <span 
        className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-100 text-blue-600 text-xs cursor-help"
        title="Níveis fixos compartilham uma escala; níveis variáveis usam escalas diferentes."
      >
        ?
      </span>
    </div>
  );
}