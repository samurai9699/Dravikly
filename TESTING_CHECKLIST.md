# Paddle Integration Testing Checklist

Use this checklist to verify everything works before going live.

## Pre-Testing Setup

- [ ] Paddle sandbox account created
- [ ] Products created in Paddle (Starter, Pro, Enterprise)
- [ ] Prices created (monthly + annual for each tier)
- [ ] All environment variables set in `.env.local`
- [ ] Database migration run (`004_paddle_migration.sql`)
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server running (`npm run dev`)
- [ ] ngrok running for webhook testing (`ngrok http 3000`)
- [ ] Paddle webhook configured with ngrok URL

---

## 1. Environment Variables ✅

Verify all required variables are set:

```bash
# Check these are set in .env.local
- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] PADDLE_API_KEY
- [ ] PADDLE_ENVIRONMENT=sandbox
- [ ] PADDLE_WEBHOOK_SECRET
- [ ] NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
- [ ] NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox
- [ ] NEXT_PUBLIC_PADDLE_STARTER_MONTHLY_PRICE_ID
- [ ] NEXT_PUBLIC_PADDLE_STARTER_ANNUAL_PRICE_ID
- [ ] NEXT_PUBLIC_PADDLE_PRO_MONTHLY_PRICE_ID
- [ ] NEXT_PUBLIC_PADDLE_PRO_ANNUAL_PRICE_ID
- [ ] NEXT_PUBLIC_PADDLE_ENTERPRISE_MONTHLY_PRICE_ID
- [ ] NEXT_PUBLIC_PADDLE_ENTERPRISE_ANNUAL_PRICE_ID
- [ ] OPENROUTER_API_KEY
- [ ] NEXT_PUBLIC_APP_URL
```

---

## 2. Database Schema ✅

Verify database has new columns:

```sql
-- Run in Supabase SQL Editor
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'subscriptions' 
AND column_name IN ('paddle_customer_id', 'paddle_subscription_id');
```

Expected result: 2 rows showing both columns exist

- [ ] `paddle_customer_id` column exists
- [ ] `paddle_subscription_id` column exists
- [ ] Indexes created on both columns

---

## 3. Free Tier Testing 🆓

### Signup Flow
- [ ] Go to `/signup`
- [ ] Create new account with test email
- [ ] Verify email confirmation (if enabled)
- [ ] Login successfully
- [ ] Redirected to dashboard

### Free Tier Limits
- [ ] Check Supabase `subscriptions` table
- [ ] User has `tier = 'free'` or `tier = 'FREE'`
- [ ] Perform 1 analysis - should work
- [ ] Perform 2nd analysis - should work
- [ ] Perform 3rd analysis - should work
- [ ] Perform 4th analysis - should work
- [ ] Perform 5th analysis - should work
- [ ] Perform 6th analysis - should be blocked with "Monthly limit reached"
- [ ] Error message shows correct limit (5 analyses)

### Free Tier Features
- [ ] Can view basic friction score
- [ ] Can view last 7 days of history
- [ ] Cannot export PDF (button disabled or shows upgrade prompt)
- [ ] Cannot access API (if you have API endpoints)

---

## 4. Pricing Page 💰

### Display
- [ ] Go to `/pricing`
- [ ] See 4 tiers: Free, Starter, Pro, Enterprise
- [ ] Monthly/Annual toggle works
- [ ] Prices update when toggling
- [ ] Annual shows savings amount
- [ ] "Most Popular" badge on Pro tier
- [ ] All features listed correctly

### Monthly Prices
- [ ] Free: $0
- [ ] Starter: $39
- [ ] Pro: $99
- [ ] Enterprise: $299

### Annual Prices (per month)
- [ ] Free: $0
- [ ] Starter: $29
- [ ] Pro: $74
- [ ] Enterprise: $224

### Savings Display
- [ ] Starter: "Save $120/year"
- [ ] Pro: "Save $300/year"
- [ ] Enterprise: "Save $900/year"

---

## 5. Checkout Flow - Starter Monthly 🚀

### Initiate Checkout
- [ ] Click "Get Started" on Starter (monthly)
- [ ] Loading spinner shows
- [ ] Redirected to Paddle checkout overlay/page
- [ ] Checkout shows correct price ($39)
- [ ] Checkout shows correct product name
- [ ] Email pre-filled (if logged in)

### Complete Payment
- [ ] Use test card: `4242 4242 4242 4242`
- [ ] Any future expiry date
- [ ] Any CVC (e.g., 123)
- [ ] Any name
- [ ] Complete checkout
- [ ] Redirected to `/dashboard?upgraded=true`

### Verify Subscription
- [ ] Check Supabase `subscriptions` table
- [ ] User tier updated to `'starter'`
- [ ] `paddle_customer_id` populated
- [ ] `paddle_subscription_id` populated
- [ ] `status = 'active'`
- [ ] `current_period_end` set correctly

### Verify Webhook
- [ ] Check ngrok web interface (http://localhost:4040)
- [ ] See POST to `/api/paddle/webhooks`
- [ ] Status 200 response
- [ ] Check Paddle Dashboard → Events
- [ ] See `transaction.completed` event
- [ ] See `subscription.created` event

---

## 6. Starter Tier Features ✅

### Usage Limits
- [ ] Perform 1 analysis - should work
- [ ] Perform 10 analyses - should work
- [ ] Perform 60 analyses - should work
- [ ] Perform 61st analysis - should be blocked
- [ ] Error shows "Monthly limit reached"
- [ ] Error shows correct limit (60)

### Features
- [ ] Can view full insights
- [ ] Can export PDF
- [ ] Can view 90-day history
- [ ] Cannot access API (if applicable)
- [ ] No priority processing badge

---

## 7. Checkout Flow - Pro Annual ⚡

### Initiate Checkout
- [ ] Go to `/pricing`
- [ ] Toggle to Annual
- [ ] Click "Upgrade to Pro"
- [ ] Redirected to Paddle checkout
- [ ] Shows annual price ($888/year or $74/month)
- [ ] Shows billing frequency (annual)

### Complete Payment
- [ ] Use test card
- [ ] Complete checkout
- [ ] Redirected to dashboard

### Verify Subscription
- [ ] Tier updated to `'pro'`
- [ ] Subscription active
- [ ] `current_period_end` is ~1 year from now
- [ ] Webhook received and processed

---

## 8. Pro Tier Features ✅

### Usage Limits
- [ ] Perform 100 analyses - should work
- [ ] Perform 300 analyses - should work
- [ ] Perform 301st analysis - should be blocked
- [ ] Error shows correct limit (300)

### Features
- [ ] Can view unlimited history
- [ ] Can export PDF
- [ ] Has API access (if applicable)
- [ ] Has priority processing
- [ ] Priority support badge visible

---

## 9. Enterprise Tier Testing 👑

### Checkout
- [ ] Purchase Enterprise plan (monthly or annual)
- [ ] Verify tier updated to `'enterprise'`
- [ ] Webhook processed correctly

### Unlimited Analyses
- [ ] Perform 100 analyses - should work
- [ ] Perform 500 analyses - should work
- [ ] Perform 1000 analyses - should work
- [ ] Never blocked (unlimited)

### Features
- [ ] Unlimited history
- [ ] PDF export
- [ ] Full API access
- [ ] Priority processing
- [ ] White-label reports (if implemented)
- [ ] Team seats (if implemented)

---

## 10. Webhook Events Testing 🔔

### Transaction Completed
- [ ] Make a purchase
- [ ] Check server logs for "transaction.completed"
- [ ] Verify subscription created in database
- [ ] Verify user tier updated

### Subscription Updated
- [ ] In Paddle Dashboard, update subscription
- [ ] Change plan or billing cycle
- [ ] Webhook received
- [ ] Database updated correctly

### Subscription Canceled
- [ ] In Paddle Dashboard, cancel subscription
- [ ] Webhook received
- [ ] User tier downgraded to 'free'
- [ ] `status = 'cancelled'`
- [ ] User can still use until period end (if applicable)

---

## 11. Edge Cases 🔍

### Multiple Purchases
- [ ] User tries to purchase while already subscribed
- [ ] Should update existing subscription, not create duplicate

### Expired Subscription
- [ ] Manually set `current_period_end` to past date
- [ ] User should be downgraded to free
- [ ] Usage limits enforced correctly

### Invalid Price ID
- [ ] Temporarily set wrong price ID in env
- [ ] Checkout should fail gracefully
- [ ] Error message shown to user

### Webhook Signature Failure
- [ ] Send webhook with invalid signature
- [ ] Should return 400 error
- [ ] Should not update database

### Network Failures
- [ ] Simulate Paddle API down
- [ ] Checkout should show error
- [ ] User not charged
- [ ] Database not updated

---

## 12. User Experience 🎨

### Upgrade Prompts
- [ ] Free user hits limit → sees upgrade modal
- [ ] Modal shows correct pricing
- [ ] "Upgrade" button works
- [ ] Can dismiss modal

### Dashboard Display
- [ ] Current tier shown correctly
- [ ] Usage stats accurate
- [ ] Remaining analyses shown
- [ ] Upgrade button visible (if not on highest tier)

### Settings Page
- [ ] Can view current subscription
- [ ] Can see billing cycle
- [ ] Can see next billing date
- [ ] Can cancel subscription (if implemented)

---

## 13. Performance ⚡

### Checkout Speed
- [ ] Checkout loads in <2 seconds
- [ ] No console errors
- [ ] Paddle overlay smooth

### Webhook Processing
- [ ] Webhooks processed in <5 seconds
- [ ] No timeout errors
- [ ] Database updates atomic

### Usage Checks
- [ ] Usage limit check <100ms
- [ ] No N+1 queries
- [ ] Proper indexing used

---

## 14. Security 🔒

### API Routes
- [ ] `/api/paddle/create-checkout` requires authentication
- [ ] Returns 401 if not logged in
- [ ] Validates tier parameter
- [ ] Validates billing cycle parameter

### Webhooks
- [ ] Signature verification works
- [ ] Invalid signatures rejected
- [ ] Replay attacks prevented (if applicable)
- [ ] Webhook secret not exposed

### Environment Variables
- [ ] No secrets in client-side code
- [ ] `PADDLE_API_KEY` only used server-side
- [ ] `PADDLE_WEBHOOK_SECRET` only used server-side

---

## 15. Error Handling 🚨

### Checkout Errors
- [ ] Invalid tier → clear error message
- [ ] Paddle API down → user-friendly error
- [ ] Network timeout → retry or error

### Webhook Errors
- [ ] Missing data → logged, not crash
- [ ] Invalid data → logged, not crash
- [ ] Database error → logged, webhook retried

### Usage Limit Errors
- [ ] Clear error message
- [ ] Shows current limit
- [ ] Shows upgrade options

---

## 16. Logging & Monitoring 📊

### Server Logs
- [ ] Checkout attempts logged
- [ ] Webhook events logged
- [ ] Errors logged with context
- [ ] No sensitive data in logs

### Paddle Dashboard
- [ ] Transactions visible
- [ ] Subscriptions visible
- [ ] Webhook logs available
- [ ] Event history accessible

### Supabase Logs
- [ ] Database queries logged
- [ ] Errors logged
- [ ] Performance metrics available

---

## 17. Documentation 📚

- [ ] `PADDLE_SETUP.md` accurate
- [ ] `MIGRATION_SUMMARY.md` complete
- [ ] `PRICING_REFERENCE.md` helpful
- [ ] Environment variables documented
- [ ] Code comments clear

---

## 18. Production Readiness 🚀

### Before Switching to Production

- [ ] All tests passing
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Paddle business verification complete
- [ ] Production products created in Paddle
- [ ] Production prices created
- [ ] Production webhook configured
- [ ] Environment variables updated for production
- [ ] Database backed up
- [ ] Monitoring set up
- [ ] Error tracking configured (Sentry, etc.)

### Production Environment Variables

```bash
PADDLE_ENVIRONMENT=production
NEXT_PUBLIC_PADDLE_ENVIRONMENT=production
# Update all price IDs to production values
# Update webhook secret to production value
```

---

## 19. Post-Launch Monitoring 👀

### First 24 Hours
- [ ] Monitor webhook success rate
- [ ] Check for failed payments
- [ ] Verify subscriptions created correctly
- [ ] Watch for error spikes
- [ ] Check user feedback

### First Week
- [ ] Track conversion rates
- [ ] Monitor churn
- [ ] Analyze usage patterns
- [ ] Collect user feedback
- [ ] Fix any bugs

### First Month
- [ ] Review pricing effectiveness
- [ ] Analyze tier distribution
- [ ] Calculate LTV
- [ ] Optimize conversion funnels
- [ ] Plan improvements

---

## 20. Rollback Plan 🔄

If something goes wrong:

1. **Immediate Actions**
   - [ ] Switch back to Stripe (if needed)
   - [ ] Restore old code from git
   - [ ] Notify affected users
   - [ ] Pause new signups

2. **Investigation**
   - [ ] Check Paddle webhook logs
   - [ ] Review server logs
   - [ ] Check database state
   - [ ] Identify root cause

3. **Fix**
   - [ ] Apply fix
   - [ ] Test thoroughly
   - [ ] Deploy fix
   - [ ] Monitor closely

---

## Summary

✅ **All tests passing?** → Ready for production
⚠️ **Some tests failing?** → Fix issues before launch
❌ **Many tests failing?** → Review setup and configuration

**Remember**: Test in sandbox thoroughly before switching to production!

---

## Quick Test Script

Run this to test basic functionality:

```bash
# 1. Start dev server
npm run dev

# 2. Start ngrok (in another terminal)
ngrok http 3000

# 3. Update Paddle webhook URL with ngrok URL

# 4. Test signup
# - Go to /signup
# - Create account
# - Verify free tier

# 5. Test checkout
# - Go to /pricing
# - Click Starter
# - Use test card: 4242 4242 4242 4242
# - Complete purchase

# 6. Verify webhook
# - Check ngrok logs
# - Check Paddle dashboard
# - Check Supabase subscriptions table

# 7. Test usage limits
# - Perform analyses
# - Verify limits enforced

# All working? ✅ Ready to deploy!
```

Good luck! 🚀
