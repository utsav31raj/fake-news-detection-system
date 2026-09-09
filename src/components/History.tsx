import { useEffect, useState } from 'react';
import { Clock, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { fetchHistory, type HistoryItem } from '../lib/api';

interface HistoryProps {
  refreshTrigger: number;
}

export function History({ refreshTrigger }: HistoryProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchHistory();
        if (!cancelled) setHistory(data);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Could not load history';
        if (!cancelled) setError(msg);
        console.error('Failed to fetch history:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [refreshTrigger]);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mt-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Clock className="w-6 h-6 text-blue-600" />
        History
      </h2>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-8 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading history...
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      ) : history.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No predictions yet</p>
      ) : (
        <div className="space-y-3">
          {history.map((item, index) => (
            <div
              key={item.id || index}
              className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3">
                {item.verdict === 'Fake' ? (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 font-medium mb-1 break-words line-clamp-2">
                    {item.text}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-sm font-semibold flex-shrink-0 ${
                        item.verdict === 'Fake' ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      {item.verdict}
                    </span>
                    <span className="text-xs text-gray-400 text-right">
                      {formatDate(item.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;
