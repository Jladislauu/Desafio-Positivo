// src/components/RubricHeader.tsx
import { useRubric } from '../context/RubricContext';
import axios from 'axios';
import { useState } from 'react';

export default function RubricHeader() {
  const { rubric, resetRubric } = useRubric();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    // Validação mínima
    if (!rubric.name.trim()) {
      setError('O nome da rubrica é obrigatório');
      return;
    }
    if (rubric.criteria.length === 0) {
      setError('Adicione pelo menos um critério');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await axios.post('http://localhost:3001/rubrics', rubric);
      alert('Rubrica salva com sucesso!');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao salvar');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Criar Rubrica</h1>
          <div className="flex gap-3">
            <button
              onClick={resetRubric}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Resetar rubrica
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              {saving ? 'Salvando...' : 'Salvar rubrica'}
            </button>
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm font-medium bg-red-50 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}