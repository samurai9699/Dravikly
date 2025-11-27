/*
  # Paddle Integration Schema (Deprecated - Replaced by main subscriptions table)

  This migration is kept for historical reference but the tables are no longer used.
  The main subscriptions table in the database now handles Paddle integration directly.
  
  See migration 005_remove_stripe_tables.sql for cleanup.
*/

-- This file is intentionally left empty as Stripe tables are being removed
-- All subscription management is now handled through the main subscriptions table with Paddle