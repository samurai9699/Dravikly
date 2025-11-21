/*
  # Create Events Table

  1. New Tables
    - `events`
      - `id` (uuid, primary key) - Unique event identifier
      - `user_id` (uuid, foreign key) - References auth.users
      - `event_type` (text) - Type of event (analysis_started, analysis_completed, etc.)
      - `metadata` (jsonb) - Flexible JSON field for event-specific data
      - `created_at` (timestamptz) - When the event occurred

  2. Security
    - Enable RLS on `events` table
    - Add policy for authenticated users to insert their own events
    - Add policy for authenticated users to read their own events
    - Add policy for service role to read all events (for analytics)

  3. Indexes
    - Index on user_id for efficient user event queries
    - Index on event_type for analytics queries
    - Index on created_at for time-based queries

  4. Notes
    - Uses JSONB for flexible metadata storage
    - Allows tracking arbitrary event properties
    - Optimized for insert-heavy workload
    - Supports analytics and user behavior tracking
*/

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_type text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own events"
  ON events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS events_user_id_idx ON events(user_id);
CREATE INDEX IF NOT EXISTS events_event_type_idx ON events(event_type);
CREATE INDEX IF NOT EXISTS events_created_at_idx ON events(created_at DESC);
CREATE INDEX IF NOT EXISTS events_user_event_type_idx ON events(user_id, event_type);
