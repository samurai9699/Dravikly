# Paddle Integration - Quick Start

Your SaaS now uses Paddle for payments instead of Stripe. Here's everything you need to know.

## What Changed?

✅ **Removed Stripe** → Added Paddle
✅ **3 tiers** → 4 tiers (added Starter)
✅ **Daily limits** → Monthly limits
✅ **Better pricing** → $39/$99/$299 (sustainable from day one)

## New Pricing

| Tier | Price | Analyses | Key Features |
|------|-------|----------|--------------|
| Free | $0 | 5 total | Basic scoring |
| Starter | $39/mo | 60/month | PDF export |
| Pro | $99/mo | 300/month | API + Priority |
| Enterprise | $299/mo | Unlimited | White-label + Teams |

Annual plans save 25% ($29/$74/$224 per month).

## Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Paddle Account
1. Go to [paddle.com](https://paddle.com) → Sign up
2. Choose **Paddle Billing** (not Classic)
3. Use **Sandbox mode** for testing

### 3. Get API Keys
In Paddle Dashboard:
- **Developer Tools** → **Authentication** → Create API Key
- **Developer Tools** → **Client-side tokens** → Copy default token
- **Developer Tools** → **Notifications** → Create webhook → Copy secret

### 4. Create Products
Create 3 products in Paddle:
- **Dravikly Starter** - $39/mo + $348/year
- **Dravikly Pro** - $99/mo + $888/year  
- **Dravikly Enterprise** - $299/mo + $2,688/year

Copy all 6 price IDs.

### 5. Configure Environment
Create `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Paddle (Sandbox)
PADDLE_API_KEY=your-api-key
PADDLE_ENVIRONMENT=sandbox
PADDLE_WEBHOOK_SECRET=your-webhook-secret
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=your-client-token
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox

# Paddle Price IDs
NEXT_PUBLIC_PADDLE_STARTER_MONTHLY_PRICE_ID=pri_xxx
NEXT_PUBLIC_PADDLE_STARTER_ANNUAL_PRICE_ID=pri_xxx
NEXT_PUBLIC_PADDLE_PRO_MONTHLY_PRICE_ID=pri_xxx
NEXT_PUBLIC_PADDLE_PRO_ANNUAL_PRICE_ID=pri_xxx
NEXT_PUBLIC_PADDLE_ENTERPRISE_MONTHLY_PRICE_ID=pri_xxx
NEXT_PUBLIC_PADDLE_ENTERPRISE_ANNUAL_PRICE_ID=pri_xxx

# OpenRouter
OPENROUTER_API_KEY=your-openrouter-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Update Database
Run in Supabase SQL Editor:

```sql
-- Copy contents from supabase/migrations/004_paddle_migration.sql
```

### 7. Test Locally
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Start ngrok for webhooks
ngrok http 3000

# Update Paddle webhook URL to: https://your-ngrok-url.ngrok.io/api/paddle/webhooks
```

### 8. Test Checkout
1. Go to `http://localhost:3000/pricing`
2. Click "Get Started" on Starter
3. Use test card: `4242 4242 4242 4242`
4. Complete checkout
5. Verify you're upgraded ✅

## File Structure

```
lib/
├── paddle-config.ts              # Pricing tiers (single source of truth)
├── paddle/
│   ├── server.ts                 # Paddle server SDK
│   └── client.ts                 # Paddle client integration
└── subscription-check-paddle.ts  # Usage limits & feature checks

app/api/paddle/
├── create-checkout/route.ts      # Checkout session creation
└── webhooks/route.ts             # Webhook handler

supabase/migrations/
└── 004_paddle_migration.sql      # Database updates

Documentation/
├── PADDLE_SETUP.md               # Detailed setup guide
├── MIGRATION_SUMMARY.md          # What changed
├── PRICING_REFERENCE.md          # Pricing strategy
└── TESTING_CHECKLIST.md          # Testing guide
```

## Key Files

### `lib/paddle-config.ts`
Single source of truth for all pricing. Update here to change tiers, prices, or limits.

### `lib/subscription-check-paddle.ts`
Usage limit enforcement. Import these functions:
- `checkMonthlyUsageLimit(userId)` - Check if user can analyze
- `canExportPDF(userId)` - Check PDF export access
- `hasAPIAccess(userId)` - Check API access
- `hasPriorityProcessing(userId)` - Check priority processing

### `app/api/paddle/webhooks/route.ts`
Handles Paddle events:
- `transaction.completed` - Payment successful
- `subscription.created` - New subscription
- `subscription.updated` - Plan changed
- `subscription.canceled` - Subscription ended

## Testing

### Test Cards (Sandbox)
- **Success**: `4242 4242 4242 4242`
- Any future expiry, any CVC

### Test Webhooks Locally
1. Install ngrok: `brew install ngrok`
2. Run: `ngrok http 3000`
3. Update Paddle webhook URL to ngrok URL
4. Make test purchase
5. Check ngrok logs: `http://localhost:4040`

### Verify Everything Works
```bash
# Run through testing checklist
cat TESTING_CHECKLIST.md
```

## Going to Production

### 1. Complete Paddle Verification
- Submit business documents
- Wait for approval (1-3 days)

### 2. Create Production Products
- Same as sandbox (Starter, Pro, Enterprise)
- Same prices ($39/$99/$299)
- Copy production price IDs

### 3. Update Environment Variables
```bash
PADDLE_ENVIRONMENT=production
NEXT_PUBLIC_PADDLE_ENVIRONMENT=production
# Update all price IDs to production values
```

### 4. Update Webhook URL
- Change from ngrok to your production domain
- `https://yourdomain.com/api/paddle/webhooks`

### 5. Deploy
```bash
# Deploy to Vercel/your platform
# Verify environment variables set
# Test with real card
# Monitor webhooks
```

## Troubleshooting

### "Paddle is not initialized"
- Check `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` is set
- Verify environment (sandbox vs production)

### Webhooks not working
- Use ngrok for local testing
- Check webhook secret matches
- View logs in Paddle Dashboard → Events

### User not upgraded after payment
- Check webhook logs in Paddle
- Verify `custom_data` sent in checkout
- Check Supabase `subscriptions` table

### Price ID errors
- Verify price IDs match Paddle Dashboard
- Check you're using correct environment (sandbox vs production)

## Support

- **Detailed Setup**: See `PADDLE_SETUP.md`
- **Migration Info**: See `MIGRATION_SUMMARY.md`
- **Pricing Strategy**: See `PRICING_REFERENCE.md`
- **Testing Guide**: See `TESTING_CHECKLIST.md`
- **Paddle Docs**: https://developer.paddle.com
- **Paddle Support**: support@paddle.com

## Next Steps

1. ✅ Read `PADDLE_SETUP.md` for detailed instructions
2. ✅ Set up Paddle sandbox account
3. ✅ Configure environment variables
4. ✅ Run database migration
5. ✅ Test with ngrok
6. ✅ Follow `TESTING_CHECKLIST.md`
7. ✅ Switch to production
8. 🚀 Launch!

---

**You're all set!** Your SaaS now has clean, sustainable pricing with Paddle handling all payment complexity.

Questions? Check the docs above or reach out to Paddle support.

Happy launching! 🎉
