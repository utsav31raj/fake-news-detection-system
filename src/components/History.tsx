import { useEffect, useState } from 'react';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface HistoryItem {
  id?: string;
  text: string;
  verdict: string;
  explanation: string;
  timestamp: string;
}

interface HistoryProps {
  refreshTrigger: number;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const API_BASE = import.meta.env.VITE_API_URL || (SUPABASE_URL ? `${SUPABASE_URL}/functions/v1` : 'http://localhost:3001');

export function History({ refreshTrigger }: HistoryProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/api-history`);
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      console.error('Failed to fetch history:', err);
      setError('Could not load history. Please check your server.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Clock className="w-6 h-6" />
        History
      </h2>

      {loading ? (
        <p className="text-gray-500 text-center py-8">Loading history...</p>
      ) : error ? (
        <p className="text-red-500 text-center py-8">{error}</p>
      ) : history.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No predictions yet</p>
      ) : (
        <div className="space-y-4">
          {history.map((item, index) => (
            <div
              key={item.id || index}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                {item.verdict === 'Fake' ? (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                )}
                <div className="flex-1">
                  <p className="text-gray-800 font-medium mb-1 break-words">
                    {item.text}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-semibold ${
                        item.verdict === 'Fake'
                          ? 'text-red-600'
                          : 'text-green-600'
                      }`}
                    >
                      {item.verdict}
                    </span>
                    <span className="text-xs text-gray-500">
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
