/*
  # Fix RLS Performance Issues

  1. Changes
    - Update all RLS policies to use (SELECT auth.uid()) instead of auth.uid()
    - This prevents re-evaluation of auth.uid() for each row, improving query performance at scale
    
  2. Affected Tables
    - subscriptions: 2 policies updated
    - analyses: 3 policies updated  
    - events: 2 policies updated
    
  3. Performance Impact
    - Significantly improves query performance for large result sets
    - Reduces function call overhead per row
    - Maintains same security guarantees
    
  4. Reference
    - See: https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select
*/

-- Drop existing policies for subscriptions
DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Users can update own subscription analytics" ON subscriptions;

-- Recreate subscriptions policies with optimized auth.uid() calls
CREATE POLICY "Users can view own subscription"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own subscription analytics"
  ON subscriptions
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- Drop existing policies for analyses
DROP POLICY IF EXISTS "Users can view own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can create own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can update own analyses" ON analyses;

-- Recreate analyses policies with optimized auth.uid() calls
CREATE POLICY "Users can view own analyses"
  ON analyses
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can create own analyses"
  ON analyses
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own analyses"
  ON analyses
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- Drop existing policies for events
DROP POLICY IF EXISTS "Users can insert their own events" ON events;
DROP POLICY IF EXISTS "Users can read their own events" ON events;

-- Recreate events policies with optimized auth.uid() calls
CREATE POLICY "Users can insert their own events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can read their own events"
  ON events
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);
