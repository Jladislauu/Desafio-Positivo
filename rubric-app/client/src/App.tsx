import { RubricProvider } from './context/RubricContext';
import RubricHeader from './components/RubricHeader';
import RubricNameInput from './components/RubricNameInput';
import TypeToggle from './components/TypeToggle';
import RubricTable from './components/RubricTable';
import { useRubric } from './context/RubricContext';

function AppContent() {
  const { rubric } = useRubric();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center"> {/* Fundo escuro, centralizado */}
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-5xl w-full"> {/* Card popup-like */}
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