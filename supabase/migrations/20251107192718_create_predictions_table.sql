/*
  # Create predictions table for Fake News Detection System

  1. New Tables
    - `predictions`
      - `id` (uuid, primary key) - Unique identifier for each prediction
      - `text` (text) - The news headline or paragraph submitted by the user
      - `verdict` (text) - The prediction result: "Real" or "Fake"
      - `explanation` (text) - Explanation for why the verdict was given
      - `timestamp` (timestamptz) - When the prediction was made
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on `predictions` table
    - Add policy for public read access (anyone can view predictions)
    - Add policy for public insert access (anyone can submit news for checking)

  3. Indexes
    - Add index on timestamp for efficient sorting of recent predictions
*/

CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  verdict text NOT NULL,
  explanation text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view predictions"
  ON predictions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert predictions"
  ON predictions FOR INSERT
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_predictions_timestamp 
  ON predictions(timestamp DESC);