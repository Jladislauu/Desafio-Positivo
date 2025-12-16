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
    <div className="ml-8">
      <span className="block text-sm font-medium text-gray-700 mb-1">Tipo</span>
      <div className="inline-flex rounded-lg bg-blue-50 p-1"> {/* Padding p-1 para margem azul visível */}
        <button
          type="button"
          onClick={() => handleChange('fixed')}
          className={`px-4 py-1 text-sm font-medium transition-all rounded-md ${
            rubric.type === 'fixed'
              ? 'bg-white text-blue-800 shadow-sm'
              : 'bg-transparent text-blue-800 hover:bg-blue-100'
          }`}
        >
          Níveis fixos
        </button>
        <button
          type="button"
          onClick={() => handleChange('variable')}
          className={`px-4 py-1 text-sm font-medium transition-all rounded-md ${
            rubric.type === 'variable'
              ? 'bg-white text-blue-800 shadow-sm'
              : 'bg-transparent text-blue-800 hover:bg-blue-100'
          }`}
        >
          Níveis variáveis
        </button>
      </div>
      <div className="group relative inline-block ml-2"> {/* Group para hover */}
        <span 
          className="inline-flex items-center justify-center w-5 h-5 rounded-full border-2 border-blue-600 text-blue-600 text-xs font-bold cursor-help bg-transparent"
        >
          ?
        </span>
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50"> {/* Balão para baixo, bg cinza escuro */}
          Níveis fixos compartilham uma escala; níveis variáveis usam escalas diferentes.
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800" /> {/* Seta para cima */}
        </div>
      </div>
    </div>
  );
}