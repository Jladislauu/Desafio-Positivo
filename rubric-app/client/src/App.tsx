import { RubricProvider } from './context/RubricContext';
import RubricHeader from './components/RubricHeader';
import RubricNameInput from './components/RubricNameInput';
import TypeToggle from './components/TypeToggle';
import RubricTable from './components/RubricTable';
import { useRubric } from './context/RubricContext';

function AppContent() {
  const { rubric } = useRubric();

  return (
    <div className="min-h-screen bg-gray-100"> {/* Fundo cinza opaco como pedido */}
      <div className="max-w-6xl mx-auto px-4 py-10"> {/* Centralizado, com padding vertical */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-8"> {/* Card único, branco, com shadow forte e arredondado */}
          <RubricHeader />
          <RubricNameInput />
          <TypeToggle />
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