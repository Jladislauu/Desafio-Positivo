// src/components/RubricHeader.tsx
import { useRubric } from '../context/RubricContext';
import axios from 'axios';
import { useState } from 'react';
import { RefreshCcw } from 'lucide-react';

export default function RubricHeader() {
  const { rubric, resetRubric } = useRubric();
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
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-blue-900">
          Criar Rubrica
        </h1>
        <div className="flex gap-3">
          <button
            onClick={resetRubric}
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition flex items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Resetar rubrica
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {saving ? 'Salvando...' : 'Salvar rubrica'}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}