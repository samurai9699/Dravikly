-- Add missing INSERT policy for subscriptions table
-- This allows authenticated users to create their own subscription record

CREATE POLICY "Users can insert own subscription"
  ON subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
