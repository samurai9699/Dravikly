/*
  # Create Analyses Table

  1. New Tables
    - `analyses`
      - `id` (uuid, primary key) - Unique identifier for analysis
      - `user_id` (uuid, foreign key) - References auth.users
      - `url` (text) - The URL that was analyzed
      - `status` (text) - Analysis status: pending, processing, completed, failed
      - `friction_score` (integer, nullable) - Overall friction score (0-100)
      - `insights` (jsonb, nullable) - AI-generated insights and recommendations
      - `created_at` (timestamptz) - Analysis creation timestamp
      - `completed_at` (timestamptz, nullable) - Analysis completion timestamp

  2. Security
    - Enable RLS on `analyses` table
    - Add policy for users to view their own analyses
    - Add policy for users to create their own analyses
    - Add policy for users to update their own analyses (for status updates)

  3. Important Notes
    - Analyses are automatically linked to authenticated users
    - Status transitions: pending -> processing -> completed/failed
    - Insights stored as JSONB for flexible structure
*/

CREATE TABLE IF NOT EXISTS analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  friction_score integer CHECK (friction_score >= 0 AND friction_score <= 100),
  insights jsonb,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analyses"
  ON analyses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own analyses"
  ON analyses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analyses"
  ON analyses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analyses_status ON analyses(status);
