import { RubricProvider } from './context/RubricContext';
import RubricHeader from './components/RubricHeader';
import RubricNameInput from './components/RubricNameInput';
import TypeToggle from './components/TypeToggle';
import RubricTable from './components/RubricTable';
import { useRubric } from './context/RubricContext';
import { X } from 'lucide-react';

function AppContent() {
  const { rubric } = useRubric();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-2"> {/* Fundo fixo escuro, margens finas laterais */}
      <div className="relative bg-white rounded-xl shadow-lg p-6 w-[95vw] max-w-[98vw] min-h-[85vh]"> {/* Card maior em altura (80% viewport height min) */}
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>
        <RubricHeader />
        <div className="flex items-start gap-6 mb-6">
          <RubricNameInput />
          <TypeToggle />
        </div>
        <div className="overflow-x-auto"> {/* Overflow para tabela se níveis excederem */}
          <RubricTable />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <RubricProvider>
      <AppContent />
    </RubricProvider>
  );
}