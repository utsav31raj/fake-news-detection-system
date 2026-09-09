import { useState } from 'react';
import { AlertCircle, CheckCircle, Loader2, Search } from 'lucide-react';
import { checkNews, type Prediction } from '../lib/api';

interface NewsCheckerProps {
  onPredictionComplete: () => void;
}

export function NewsChecker({ onPredictionComplete }: NewsCheckerProps) {
  const [text, setText] = useState('');
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const check = async () => {
    if (!text.trim()) {
      setError('Please enter some text to check');
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const data = await checkNews(text);
      setPrediction(data);
      onPredictionComplete();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to check news';
      setError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border border-gray-100">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter a news headline or paragraph to check..."
        className="w-full h-32 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all"
      />

      <button
        onClick={check}
        disabled={loading}
        className="mt-4 w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Checking...
          </>
        ) : (
          <>
            <Search className="w-5 h-5" />
            Check News
          </>
        )}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {prediction && (
        <div className="mt-6">
          <div
            className={`p-5 rounded-xl flex items-center gap-4 ${
              prediction.verdict === 'Fake'
                ? 'bg-red-50 border border-red-200'
                : 'bg-green-50 border border-green-200'
            }`}
          >
            {prediction.verdict === 'Fake' ? (
              <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
            ) : (
              <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
            )}
            <div>
              <p
                className={`text-lg font-semibold ${
                  prediction.verdict === 'Fake' ? 'text-red-700' : 'text-green-700'
                }`}
              >
                This news appears {prediction.verdict}
              </p>
              <p className="text-sm text-gray-600 mt-1">{prediction.explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewsChecker;
