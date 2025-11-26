-- Fix subscription insert for webhooks
-- The service role should bypass RLS, but we need to ensure the policies don't conflict

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Users can update own subscription analytics" ON subscriptions;
DROP POLICY IF EXISTS "Users can insert own subscription" ON subscriptions;

-- Recreate policies with proper permissions
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

CREATE POLICY "Users can insert own subscription"
  ON subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- CRITICAL: Allow service role to bypass RLS for webhook operations
-- Service role should already bypass RLS, but let's be explicit
CREATE POLICY "Service role can manage all subscriptions"
  ON subscriptions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add comment for documentation
COMMENT ON POLICY "Service role can manage all subscriptions" ON subscriptions IS 
'Allows webhook handlers using service role to create/update subscriptions for any user';
