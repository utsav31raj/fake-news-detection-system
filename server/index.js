import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
}

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const fakeNewsKeywords = ['shocking', 'unbelievable', 'breaking', 'click here', 'you won\'t believe', 'secret', 'miracle', 'doctors hate'];

app.post('/api/predict', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Supabase client not initialized' });
    }

    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const lowerText = text.toLowerCase();
    const foundKeywords = fakeNewsKeywords.filter(keyword =>
      lowerText.includes(keyword)
    );

    const verdict = foundKeywords.length > 0 ? 'Fake' : 'Real';
    const explanation = foundKeywords.length > 0
      ? `Contains sensational keywords: "${foundKeywords.join('", "')}"`
      : 'No suspicious language detected';

    const { data, error } = await supabase
      .from('predictions')
      .insert([
        {
          text,
          verdict,
          explanation,
          timestamp: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to save prediction' });
    }

    res.json({
      verdict,
      explanation,
      id: data.id
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/history', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Supabase client not initialized' });
    }

    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch history' });
    }

    res.json(data || []);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on 0.0.0.0:${PORT}`);
});
