/*
  # Paddle Migration - Update subscriptions table for Paddle

  1. Changes
    - Add paddle_customer_id column
    - Add paddle_subscription_id column
    - Remove stripe-specific columns (or keep for backward compatibility)
    - Update tier enum to include new tiers
    
  2. Notes
    - This migration is safe to run even if you have existing Stripe data
    - Old Stripe columns are kept for reference but can be removed later
*/

-- Add Paddle columns
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS paddle_customer_id text,
ADD COLUMN IF NOT EXISTS paddle_subscription_id text;

-- Create indexes for Paddle IDs
CREATE INDEX IF NOT EXISTS idx_subscriptions_paddle_customer ON subscriptions(paddle_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_paddle_subscription ON subscriptions(paddle_subscription_id);

-- Update tier check constraint to include new tiers
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_tier_check;
ALTER TABLE subscriptions 
ADD CONSTRAINT subscriptions_tier_check 
CHECK (tier IN ('FREE', 'STARTER', 'PRO', 'ENTERPRISE', 'free', 'starter', 'pro', 'enterprise'));

-- Add comment
COMMENT ON COLUMN subscriptions.paddle_customer_id IS 'Paddle customer ID';
COMMENT ON COLUMN subscriptions.paddle_subscription_id IS 'Paddle subscription ID';
