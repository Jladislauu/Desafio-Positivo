import { useRubric } from '../context/RubricContext';
import { useState } from 'react';

export default function TypeToggle() {
  const { rubric, updateRubric } = useRubric();
  const [animating, setAnimating] = useState(false); // Controle de animação para delay

  const handleChange = (type: 'fixed' | 'variable') => {
    if (type === rubric.type) return;
    setAnimating(true); // Inicia animação
    setTimeout(() => { // Delay para animação completar antes de atualizar estado
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
      setAnimating(false); // Finaliza animação
    }, 300); // Duração match com transition
  };

  return (
    <div className="ml-8">
      <span className="block text-sm font-medium text-gray-700 mb-1">Tipo</span>
      <div className="relative inline-flex rounded-lg bg-blue-50 p-1 overflow-hidden w-64"> {/* p-1 para margem maior no fundo azul, w-64 para slide fixo */}
        <div 
          className={`absolute top-1 bottom-1 w-1/2 bg-white rounded-md shadow-sm transition-all duration-300 ease-in-out ${
            rubric.type === 'variable' ? 'translate-x-full' : 'translate-x-0'
          } ${animating ? 'opacity-90' : ''}`} // Slider com translate para arrasto, opacity sutil durante animação
        />
        <button
          type="button"
          onClick={() => handleChange('fixed')}
          className="relative z-10 px-4 py-1 text-sm font-medium text-blue-800 w-1/2 transition-colors duration-300" // py-1 para branco menor
        >
          Níveis fixos
        </button>
        <button
          type="button"
          onClick={() => handleChange('variable')}
          className="relative z-10 px-4 py-1 text-sm font-medium text-blue-800 w-1/2 transition-colors duration-300" // py-1 para branco menor
        >
          Níveis variáveis
        </button>
      </div>
      <span 
        className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full border-2 border-blue-600 text-blue-600 text-xs font-bold cursor-help bg-transparent"
        title="Níveis fixos compartilham uma escala; níveis variáveis usam escalas diferentes."
      >
        ?
      </span>
    </div>
  );
}