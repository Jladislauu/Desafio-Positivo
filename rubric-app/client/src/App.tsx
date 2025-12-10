import { RubricProvider } from './context/RubricContext';
import RubricHeader from './components/RubricHeader';
import { useRubric } from './context/RubricContext';

function AppContent() {
  const { rubric } = useRubric();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <RubricHeader />
        <pre className="mt-10 p-4 bg-gray-900 text-green-400 text-xs rounded-lg overflow-x-auto">
          {JSON.stringify(rubric, null, 2)}
        </pre>
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