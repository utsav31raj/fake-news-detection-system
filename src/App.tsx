import { useState } from "react";
import { Newspaper } from "lucide-react";
import NewsChecker from "./components/NewsChecker";
import History from "./components/History";

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePredictionComplete = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Newspaper className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">
              Fake News Detection System
            </h1>
          </div>
          <p className="text-gray-600 mt-2">
            Enter a news headline or paragraph to check its authenticity
          </p>
        </div>

        {/* Main input + check component */}
        <NewsChecker onPredictionComplete={handlePredictionComplete} />

        {/* History section */}
        <History refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}

export default App;
