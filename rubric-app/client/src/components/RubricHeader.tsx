// src/components/RubricHeader.tsx
import { useRubric } from '../context/RubricContext';
import axios from 'axios';
import { useState } from 'react';
import { RotateCcw } from 'lucide-react';

export default function RubricHeader() {
  const { rubric, resetRubric, isInitial } = useRubric();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!rubric.name.trim()) {
      setError('O nome da rubrica é obrigatório');
      return;
    }
    if (rubric.criteria.length === 0) {
      setError('Adicione pelo menos um critério');
      return;
    }
    if (rubric.type === 'fixed' && (!rubric.globalLevels || rubric.globalLevels.length === 0)) {
      setError('Adicione pelo menos um nível');
      return;
    }
    if (rubric.type === 'variable' && rubric.criteria.some(c => c.levels.length === 0)) {
      setError('Cada critério deve ter pelo menos um nível');
      return;
    }

    // Formatar payload para backend: add order, remove ids
    const formattedRubric = {
      name: rubric.name,
      type: rubric.type,
      criteria: rubric.criteria.map((c, index) => ({
        name: c.name,
        order: index + 1, // Adiciona order sequencial
        levels: c.levels.map(l => ({
          label: l.label || null, // Optional
          points: l.points,
          description: l.description || ''
        }))
      }))
    };

    console.log('Payload formatado para enviar:', JSON.stringify(formattedRubric, null, 2)); // Debug

    setSaving(true);
    setError('');

    try {
      await axios.post('http://localhost:3001/rubrics', formattedRubric);
      alert('Rubrica salva com sucesso!');
    } catch (err: any) {
      console.error('Erro completo:', err);
      setError(err.response?.data?.error || err.message || 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-blue-900">
          Criar Rubrica
        </h1>
        <div className="flex gap-3">
          <button
            onClick={resetRubric}
            disabled={isInitial}
            className={`px-4 py-2 rounded-md flex items-center transition ${
              isInitial 
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                : 'border border-blue-500 text-blue-500 hover:bg-blue-50 bg-white'
            }`}
          >
            <RotateCcw className={`w-4 h-4 mr-2 ${isInitial ? 'text-gray-500' : 'text-blue-500'}`} />
            Resetar rubrica
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !rubric.name.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {saving ? 'Salvando...' : 'Salvar rubrica'}
          </button>
        </div>
      </div>
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md mb-6">
          {error}
        </div>
      )}
    </>
  );
}