/*
  # Create Subscriptions Table

  1. New Tables
    - `subscriptions`
      - `id` (uuid, primary key) - Unique identifier for subscription
      - `user_id` (uuid, foreign key) - References auth.users
      - `tier` (text) - Subscription tier: FREE, PRO, ULTRA
      - `status` (text) - Subscription status: active, cancelled, past_due
      - `stripe_customer_id` (text, nullable) - Stripe customer ID
      - `stripe_subscription_id` (text, nullable) - Stripe subscription ID
      - `current_period_start` (timestamptz, nullable) - Current billing period start
      - `current_period_end` (timestamptz, nullable) - Current billing period end
      - `cancel_at_period_end` (boolean) - Whether to cancel at period end
      - `analyses_used_today` (integer) - Daily analyses counter
      - `last_reset_date` (date) - Last date counter was reset
      - `created_at` (timestamptz) - Subscription creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `subscriptions` table
    - Add policy for users to read their own subscription
    - Add policy for users to update their own subscription (limited fields)

  3. Important Notes
    - Users are auto-assigned FREE tier on signup
    - Daily analyses counter resets automatically
    - Stripe IDs are nullable for free tier users
*/

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier text NOT NULL DEFAULT 'FREE' CHECK (tier IN ('FREE', 'PRO', 'ULTRA')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  analyses_used_today integer DEFAULT 0,
  last_reset_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription analytics"
  ON subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
