import { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
interface Prediction {
  verdict: string;
  explanation: string;
}

interface NewsCheckerProps {
  onPredictionComplete: () => void;
}

export function NewsChecker({ onPredictionComplete }: NewsCheckerProps) {
  const [text, setText] = useState('');
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkNews = async () => {
    if (!text.trim()) {
      setError('Please enter some text to check');
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch(`${API_BASE}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to check news');
      }

      const data = await response.json();
      setPrediction(data);
      onPredictionComplete();
    } catch (err) {
      setError('Failed to check news. Make sure the server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter a news headline or paragraph to check..."
        className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      <button
        onClick={checkNews}
        disabled={loading}
        className="mt-4 w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Checking...' : 'Check News'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {prediction && (
        <div className="mt-6 space-y-4">
          <div
            className={`p-4 rounded-lg flex items-center gap-3 ${
              prediction.verdict === 'Fake'
                ? 'bg-red-50 border border-red-200'
                : 'bg-green-50 border border-green-200'
            }`}
          >
            {prediction.verdict === 'Fake' ? (
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            ) : (
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            )}
            <div>
              <p
                className={`text-lg font-semibold ${
                  prediction.verdict === 'Fake' ? 'text-red-700' : 'text-green-700'
                }`}
              >
                This news appears {prediction.verdict}
              </p>
              <p className="text-sm text-gray-700 mt-1">{prediction.explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ✅ Add this line so App.tsx can import it as: import NewsChecker from './components/NewsChecker';
export default NewsChecker;
