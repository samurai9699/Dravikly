/*
  # Initial Schema Setup

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - Unique user identifier
      - `email` (text, unique, not null) - User email address
      - `created_at` (timestamptz) - Account creation timestamp

    - `subscriptions`
      - `id` (uuid, primary key) - Unique subscription identifier
      - `user_id` (uuid, foreign key) - Reference to users table
      - `stripe_customer_id` (text, unique) - Stripe customer identifier
      - `stripe_subscription_id` (text, unique) - Stripe subscription identifier
      - `tier` (text, not null) - Subscription tier (free, pro, enterprise)
      - `status` (text, not null) - Subscription status (active, canceled, past_due)
      - `current_period_end` (timestamptz) - Current billing period end date
      - `created_at` (timestamptz) - Subscription creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `analyses`
      - `id` (uuid, primary key) - Unique analysis identifier
      - `user_id` (uuid, foreign key) - Reference to users table
      - `url` (text, not null) - URL that was analyzed
      - `results` (jsonb) - Analysis results stored as JSON
      - `created_at` (timestamptz) - Analysis creation timestamp

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to:
      - Read their own user data
      - Read and update their own subscription
      - Create, read their own analyses
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id text UNIQUE,
  stripe_subscription_id text UNIQUE,
  tier text NOT NULL DEFAULT 'free',
  status text NOT NULL DEFAULT 'active',
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_tier CHECK (tier IN ('free', 'pro', 'enterprise')),
  CONSTRAINT valid_status CHECK (status IN ('active', 'canceled', 'past_due', 'incomplete', 'trialing'))
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own subscription"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own subscription"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  url text NOT NULL,
  results jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create own analyses"
  ON analyses FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read own analyses"
  ON analyses FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at DESC);
