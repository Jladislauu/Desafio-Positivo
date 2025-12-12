import { useRubric } from '../context/RubricContext';

export default function RubricNameInput() {
  const { rubric, updateRubric } = useRubric();

  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
      <input
        type="text"
        value={rubric.name}
        onChange={(e) => updateRubric({ name: e.target.value })}
        placeholder="Ex: Rubrica de Matemática 9º ano"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
      />
      {!rubric.name && (
        <p className="mt-1 text-sm text-red-600">O nome da rubrica é obrigatório</p>
      )}
    </div>
  );
}