const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const API_URL = import.meta.env.VITE_API_URL || (SUPABASE_URL ? `${SUPABASE_URL}/functions/v1` : '');

if (!API_URL) {
  console.error('VITE_API_URL is not set. The app cannot reach the backend.');
}

const headers = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
};

export interface Prediction {
  id?: string;
  verdict: string;
  explanation: string;
}

export interface HistoryItem {
  id?: string;
  text: string;
  verdict: string;
  explanation: string;
  timestamp: string;
}

export async function checkNews(text: string): Promise<Prediction> {
  const response = await fetch(`${API_URL}/api-predict`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to check news');
  }

  return response.json();
}

export async function fetchHistory(): Promise<HistoryItem[]> {
  const response = await fetch(`${API_URL}/api-history`, { headers });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch history');
  }

  return response.json();
}
