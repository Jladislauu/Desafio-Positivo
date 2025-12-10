export default function RubricHeader() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Criar Rubrica</h1>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Resetar rubrica
          </button>
          <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Salvar rubrica
          </button>
        </div>
      </div>
    </div>
  );
}