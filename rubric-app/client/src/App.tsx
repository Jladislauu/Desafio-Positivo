import { RubricProvider } from './context/RubricContext';
import RubricHeader from './components/RubricHeader';
import RubricNameInput from './components/RubricNameInput';
import TypeToggle from './components/TypeToggle';
import RubricTable from './components/RubricTable';
import { useRubric } from './context/RubricContext';

function AppContent() {
  const { rubric } = useRubric();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <RubricHeader />
        <RubricNameInput />
        <TypeToggle />
        <RubricTable />

        {/* Debug opcional */}
        {/* <pre className="mt-10 text-xs bg-gray-900 text-green-400 p-4 rounded">
          {JSON.stringify(rubric, null, 2)}
        </pre> */}
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