-- ============================================
-- Paddle Migration Script
-- Run this in your Supabase SQL Editor
-- ============================================

-- Step 1: Ensure Paddle columns exist (from migration 004)
-- This is safe to run multiple times
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS paddle_customer_id text,
ADD COLUMN IF NOT EXISTS paddle_subscription_id text;

-- Create indexes for Paddle IDs
CREATE INDEX IF NOT EXISTS idx_subscriptions_paddle_customer ON subscriptions(paddle_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_paddle_subscription ON subscriptions(paddle_subscription_id);

-- Update tier check constraint to include new tiers
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_tier_check;
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS valid_tier;
ALTER TABLE subscriptions 
ADD CONSTRAINT subscriptions_tier_check 
CHECK (tier IN ('free', 'starter', 'pro', 'enterprise'));

-- Update status check constraint
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS valid_status;
ALTER TABLE subscriptions 
ADD CONSTRAINT subscriptions_status_check 
CHECK (status IN ('active', 'cancelled', 'canceled', 'past_due', 'trialing', 'paused'));

-- Add comments
COMMENT ON COLUMN subscriptions.paddle_customer_id IS 'Paddle customer ID';
COMMENT ON COLUMN subscriptions.paddle_subscription_id IS 'Paddle subscription ID';

-- ============================================
-- Step 2: Clean up existing data (if needed)
-- ============================================

-- Normalize tier names to lowercase
UPDATE subscriptions 
SET tier = LOWER(tier)
WHERE tier != LOWER(tier);

-- Map old tier names to new ones (if you had different naming)
-- Uncomment if needed:
-- UPDATE subscriptions SET tier = 'enterprise' WHERE tier = 'ultra';
-- UPDATE subscriptions SET tier = 'pro' WHERE tier = 'premium';

-- ============================================
-- Step 3: Remove Stripe tables and views
-- ============================================

-- Drop views first (they depend on tables)
DROP VIEW IF EXISTS stripe_user_subscriptions;
DROP VIEW IF EXISTS stripe_user_orders;

-- Drop tables
DROP TABLE IF EXISTS stripe_orders CASCADE;
DROP TABLE IF EXISTS stripe_subscriptions CASCADE;
DROP TABLE IF EXISTS stripe_customers CASCADE;

-- Drop custom enum types
DROP TYPE IF EXISTS stripe_subscription_status CASCADE;
DROP TYPE IF EXISTS stripe_order_status CASCADE;

-- ============================================
-- Step 4: Remove Stripe columns from subscriptions (optional)
-- Only do this if you're 100% sure you don't need the data
-- ============================================

-- Uncomment to remove Stripe columns:
 ALTER TABLE subscriptions DROP COLUMN IF EXISTS stripe_customer_id;
 ALTER TABLE subscriptions DROP COLUMN IF EXISTS stripe_subscription_id;

-- ============================================
-- Step 5: Verify the migration
-- ============================================

-- Check subscriptions table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'subscriptions'
ORDER BY ordinal_position;

-- Check existing subscriptions
SELECT 
    user_id,
    tier,
    status,
    paddle_customer_id,
    paddle_subscription_id,
    current_period_end,
    created_at
FROM subscriptions
ORDER BY created_at DESC
LIMIT 10;

-- Check for any remaining Stripe tables
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE '%stripe%';

-- ============================================
-- Migration Complete!
-- ============================================

-- You should see:
-- ✅ paddle_customer_id and paddle_subscription_id columns exist
-- ✅ All tiers are lowercase: 'free', 'starter', 'pro', 'enterprise'
-- ✅ No stripe_* tables exist
-- ✅ Indexes on Paddle columns exist
