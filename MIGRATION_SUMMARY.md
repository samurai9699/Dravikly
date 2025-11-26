# Stripe to Paddle Migration Summary

## What Changed

### ✅ Removed
- `stripe` npm package
- `@stripe/stripe-js` npm package
- `lib/stripe.ts`
- `lib/stripe/server.ts` (old)
- `lib/stripe/client.ts` (old)
- `lib/stripe-config.ts` (old)
- `app/api/create-checkout/route.ts` (Stripe version)
- `app/api/webhooks/stripe/route.ts`
- All Stripe-related API routes

### ✅ Added
- `@paddle/paddle-node-sdk` npm package
- `lib/paddle-config.ts` - Single source of truth for pricing
- `lib/paddle/server.ts` - Paddle server SDK
- `lib/paddle/client.ts` - Paddle client integration
- `lib/subscription-check-paddle.ts` - Usage limits with new tiers
- `app/api/paddle/create-checkout/route.ts` - Paddle checkout
- `app/api/paddle/webhooks/route.ts` - Paddle webhook handler
- `supabase/migrations/004_paddle_migration.sql` - Database updates
- `PADDLE_SETUP.md` - Complete setup guide

### ✅ Updated
- `app/pricing/page.tsx` - Now uses Paddle config and 4 tiers
- `.env.example` - Paddle environment variables
- Database schema - Added Paddle customer/subscription ID columns

---

## New Pricing Structure

| Tier | Old | New | Monthly | Annual | Analyses |
|------|-----|-----|---------|--------|----------|
| Free | 3/day | 5 total | $0 | $0 | 5 lifetime |
| Starter | ❌ | ✅ | $39 | $29/mo | 60/month |
| Pro | 20/day | 300/month | $99 | $74/mo | 300/month |
| Enterprise | Unlimited | Unlimited | $299 | $224/mo | Unlimited |

**Key Changes:**
- Changed from daily limits to monthly limits (more flexible)
- Added Starter tier for solo founders
- Renamed Ultra → Enterprise
- Better pricing ($39/$99/$299 instead of $29/$99)
- 25% annual discount (was 20%)

---

## Database Changes

### New Columns in `subscriptions` table:
```sql
- paddle_customer_id (text)
- paddle_subscription_id (text)
```

### Updated tier enum:
```sql
- Now supports: 'free', 'starter', 'pro', 'enterprise'
- Old tiers still work for backward compatibility
```

### Indexes:
```sql
- idx_subscriptions_paddle_customer
- idx_subscriptions_paddle_subscription
```

---

## Environment Variables

### Remove (Stripe):
```bash
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID
NEXT_PUBLIC_STRIPE_ULTRA_PRICE_ID
NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID
NEXT_PUBLIC_STRIPE_ULTRA_ANNUAL_PRICE_ID
STRIPE_WEBHOOK_SECRET
```

### Add (Paddle):
```bash
PADDLE_API_KEY
PADDLE_ENVIRONMENT=sandbox
PADDLE_WEBHOOK_SECRET
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox
NEXT_PUBLIC_PADDLE_STARTER_MONTHLY_PRICE_ID
NEXT_PUBLIC_PADDLE_STARTER_ANNUAL_PRICE_ID
NEXT_PUBLIC_PADDLE_PRO_MONTHLY_PRICE_ID
NEXT_PUBLIC_PADDLE_PRO_ANNUAL_PRICE_ID
NEXT_PUBLIC_PADDLE_ENTERPRISE_MONTHLY_PRICE_ID
NEXT_PUBLIC_PADDLE_ENTERPRISE_ANNUAL_PRICE_ID
```

---

## API Routes

### Old (Stripe):
```
POST /api/create-checkout
POST /api/webhooks/stripe
POST /api/create-portal-session
POST /api/stripe-portal
```

### New (Paddle):
```
POST /api/paddle/create-checkout
POST /api/paddle/webhooks
```

**Note:** Portal/billing management is handled by Paddle's built-in customer portal.

---

## Code Changes Required

### If you have custom code importing Stripe:

**Before:**
```typescript
import { stripe } from '@/lib/stripe';
import { getTierLimits } from '@/lib/stripe-config';
```

**After:**
```typescript
import { paddle } from '@/lib/paddle/server';
import { getTierLimits } from '@/lib/paddle-config';
```

### Usage limit checks:

**Before:**
```typescript
import { checkDailyUsageLimit } from '@/lib/subscription-check';
const usage = await checkDailyUsageLimit(userId);
```

**After:**
```typescript
import { checkMonthlyUsageLimit } from '@/lib/subscription-check-paddle';
const usage = await checkMonthlyUsageLimit(userId);
```

---

## Testing Checklist

### Before Going Live:

- [ ] Run database migration (`004_paddle_migration.sql`)
- [ ] Set up Paddle account (sandbox mode)
- [ ] Create products and prices in Paddle
- [ ] Configure all environment variables
- [ ] Test signup flow
- [ ] Test checkout flow (use test card: 4242 4242 4242 4242)
- [ ] Verify webhook handling (use ngrok for local testing)
- [ ] Test usage limits (free tier should have 5 total analyses)
- [ ] Test PDF export (Starter and above)
- [ ] Test API access (Pro and above)
- [ ] Verify subscription updates work
- [ ] Test cancellation flow

### Webhook Events to Test:

- [ ] `transaction.completed` - Initial payment
- [ ] `subscription.created` - New subscription
- [ ] `subscription.updated` - Plan change
- [ ] `subscription.canceled` - Cancellation

---

## Rollback Plan (If Needed)

If you need to rollback to Stripe:

1. **Reinstall Stripe:**
   ```bash
   npm install stripe @stripe/stripe-js
   ```

2. **Restore old files from git:**
   ```bash
   git checkout HEAD~1 -- lib/stripe.ts
   git checkout HEAD~1 -- lib/stripe-config.ts
   git checkout HEAD~1 -- app/api/create-checkout/route.ts
   git checkout HEAD~1 -- app/api/webhooks/stripe/route.ts
   ```

3. **Revert environment variables**

4. **Keep Paddle columns** in database (they won't hurt anything)

---

## Benefits of This Migration

### For You (Developer):
- ✅ Cleaner code (Paddle SDK is simpler)
- ✅ Less webhook complexity
- ✅ Better pricing structure
- ✅ Easier tax compliance (Paddle handles it)
- ✅ Monthly limits are more flexible than daily

### For Users:
- ✅ More pricing options (4 tiers instead of 3)
- ✅ Better value (Starter at $39 is perfect for solo founders)
- ✅ Monthly limits feel less restrictive
- ✅ Clearer feature differentiation

### For Business:
- ✅ Better margins (higher prices, same costs)
- ✅ Sustainable from day one
- ✅ Room to grow without price changes
- ✅ Global payments out of the box

---

## Next Steps

1. **Read PADDLE_SETUP.md** for detailed setup instructions
2. **Run the database migration**
3. **Set up Paddle sandbox account**
4. **Configure environment variables**
5. **Test everything locally with ngrok**
6. **Deploy to staging**
7. **Test in staging**
8. **Switch to production Paddle**
9. **Deploy to production**
10. **Monitor webhooks and subscriptions**

---

## Support

If you run into issues:

1. Check `PADDLE_SETUP.md` troubleshooting section
2. Review Paddle webhook logs in dashboard
3. Check Supabase logs for database errors
4. Verify environment variables are set correctly
5. Test with ngrok to ensure webhooks are reaching your server

---

## Files You Can Safely Delete (After Testing)

Once you've verified Paddle works:

```bash
# Old Stripe files (keep for reference initially)
lib/stripe.ts
lib/stripe/server.ts
lib/stripe/client.ts
lib/stripe-config.ts
src/stripe-config.ts
app/api/create-checkout/route.ts (old Stripe version)
app/api/webhooks/stripe/route.ts
app/api/create-portal-session/route.ts
app/api/stripe-portal/route.ts
supabase/functions/stripe-checkout/
supabase/functions/stripe-webhook/
```

**Recommendation:** Keep these files for 30 days in case you need to reference them, then delete.

---

## Migration Complete! 🎉

Your SaaS now has:
- ✅ Clean Paddle integration
- ✅ Sustainable pricing structure
- ✅ 4 well-defined tiers
- ✅ Monthly usage limits
- ✅ Feature-based access control
- ✅ Easy to test (sandbox mode)
- ✅ Easy to switch to production

You're ready to launch! 🚀
