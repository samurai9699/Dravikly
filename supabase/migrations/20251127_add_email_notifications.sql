-- Add email_notifications column to subscriptions table
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS email_notifications boolean DEFAULT true;

-- Add comment
COMMENT ON COLUMN subscriptions.email_notifications IS 'Whether user wants to receive email notifications for completed analyses';
