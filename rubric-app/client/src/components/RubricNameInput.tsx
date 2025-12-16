import { useRubric } from '../context/RubricContext';

export default function RubricNameInput() {
  const { rubric, updateRubric } = useRubric();

  return (
    <div className="flex flex-col">
      <label className="block text-sm font-medium text-gray-600 mb-1">Nome</label>
      <input
        type="text"
        value={rubric.name}
        onChange={(e) => updateRubric({ name: e.target.value })}
        placeholder=""
        className="w-full text-lg" /* Sem border, via global css */
      />
      {!rubric.name && (
        <p className="mt-1 text-sm text-red-600">O nome da rubrica é obrigatório</p>
      )}
    </div>
  );
}