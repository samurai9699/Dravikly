/*
  # Remove Stripe Tables and Views

  1. Drop Stripe-specific tables and views
    - Drop stripe_user_subscriptions view
    - Drop stripe_user_orders view
    - Drop stripe_orders table
    - Drop stripe_subscriptions table
    - Drop stripe_customers table
    - Drop custom enum types

  2. Notes
    - This migration removes all Stripe-related infrastructure
    - Paddle is now the payment provider
    - Run this after ensuring all data is migrated if needed
*/

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

-- Add comment
COMMENT ON TABLE subscriptions IS 'User subscriptions managed via Paddle';
