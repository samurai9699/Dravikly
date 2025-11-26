# Paddle Integration Setup Guide

This guide will help you set up Paddle for your SaaS. We're using **Paddle Billing** (not Paddle Classic).

## Why Paddle?

- **Merchant of Record**: Paddle handles all tax compliance (VAT, sales tax) automatically
- **Global payments**: Supports 100+ currencies and local payment methods
- **Simpler than Stripe**: Less code, fewer edge cases
- **Better for SaaS**: Built specifically for subscription businesses

---

## Step 1: Create Paddle Account

1. Go to [paddle.com](https://www.paddle.com) and sign up
2. Choose **Paddle Billing** (not Paddle Classic)
3. Complete your business verification (required for live mode)
4. For now, we'll use **Sandbox mode** for testing

---

## Step 2: Get Your API Keys

### Sandbox API Key

1. Log into Paddle Dashboard
2. Go to **Developer Tools** → **Authentication**
3. Click **Create API Key**
4. Name it "Development" or "Sandbox"
5. Copy the API key → Add to `.env.local` as `PADDLE_API_KEY`

### Client-Side Token

1. In Paddle Dashboard, go to **Developer Tools** → **Client-side tokens**
2. Copy your **Default token**
3. Add to `.env.local` as `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`

### Webhook Secret

1. Go to **Developer Tools** → **Notifications**
2. Click **Create notification destination**
3. URL: `https://your-domain.com/api/paddle/webhooks` (use ngrok for local testing)
4. Select these events:
   - `transaction.completed`
   - `subscription.created`
   - `subscription.updated`
   - `subscription.canceled`
   - `subscription.paused`
5. Copy the **Webhook secret** → Add to `.env.local` as `PADDLE_WEBHOOK_SECRET`

---

## Step 3: Create Products and Prices

### Starter Plan

1. Go to **Catalog** → **Products**
2. Click **Create Product**
3. Fill in:
   - **Name**: Dravikly Starter
   - **Description**: For solo founders
   - **Tax category**: Standard (SaaS)
4. Click **Create**

5. Now create prices:
   - Click **Add Price**
   - **Monthly**: $39/month, recurring monthly
   - Copy the Price ID → Add to `.env.local` as `NEXT_PUBLIC_PADDLE_STARTER_MONTHLY_PRICE_ID`
   
   - Click **Add Price** again
   - **Annual**: $348/year, recurring yearly (equivalent to $29/month)
   - Copy the Price ID → Add to `.env.local` as `NEXT_PUBLIC_PADDLE_STARTER_ANNUAL_PRICE_ID`

### Pro Plan

Repeat the same process:
- **Name**: Dravikly Pro
- **Monthly**: $99/month → `NEXT_PUBLIC_PADDLE_PRO_MONTHLY_PRICE_ID`
- **Annual**: $888/year → `NEXT_PUBLIC_PADDLE_PRO_ANNUAL_PRICE_ID`

### Enterprise Plan

Repeat the same process:
- **Name**: Dravikly Enterprise
- **Monthly**: $299/month → `NEXT_PUBLIC_PADDLE_ENTERPRISE_MONTHLY_PRICE_ID`
- **Annual**: $2,688/year → `NEXT_PUBLIC_PADDLE_ENTERPRISE_ANNUAL_PRICE_ID`

---

## Step 4: Configure Environment Variables

Create or update your `.env.local` file:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Paddle (Sandbox for testing)
PADDLE_API_KEY=your-paddle-api-key
PADDLE_ENVIRONMENT=sandbox
PADDLE_WEBHOOK_SECRET=your-webhook-secret
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=your-client-token
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox

# Paddle Price IDs
NEXT_PUBLIC_PADDLE_STARTER_MONTHLY_PRICE_ID=pri_01xxxxx
NEXT_PUBLIC_PADDLE_STARTER_ANNUAL_PRICE_ID=pri_01xxxxx
NEXT_PUBLIC_PADDLE_PRO_MONTHLY_PRICE_ID=pri_01xxxxx
NEXT_PUBLIC_PADDLE_PRO_ANNUAL_PRICE_ID=pri_01xxxxx
NEXT_PUBLIC_PADDLE_ENTERPRISE_MONTHLY_PRICE_ID=pri_01xxxxx
NEXT_PUBLIC_PADDLE_ENTERPRISE_ANNUAL_PRICE_ID=pri_01xxxxx

# OpenRouter
OPENROUTER_API_KEY=your-openrouter-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Step 5: Update Supabase Database

Run the Paddle migration:

```sql
-- In Supabase SQL Editor, run:
-- Copy contents from supabase/migrations/004_paddle_migration.sql
```

Or if you have Supabase CLI:

```bash
supabase db push
```

---

## Step 6: Test Locally with ngrok

Since Paddle needs to send webhooks to your server, you need a public URL:

1. Install ngrok: `brew install ngrok` (or download from ngrok.com)

2. Start your dev server:
```bash
npm run dev
```

3. In another terminal, start ngrok:
```bash
ngrok http 3000
```

4. Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)

5. Update Paddle webhook URL:
   - Go to Paddle Dashboard → **Developer Tools** → **Notifications**
   - Edit your notification destination
   - URL: `https://abc123.ngrok.io/api/paddle/webhooks`
   - Save

6. Test a checkout:
   - Go to `http://localhost:3000/pricing`
   - Click on a paid plan
   - Use Paddle's test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any CVC

7. Check webhook logs in Paddle Dashboard to verify it worked

---

## Step 7: Verify Everything Works

### Test Checkout Flow

1. Sign up for a free account
2. Go to pricing page
3. Click "Get Started" on Starter plan
4. Complete checkout with test card
5. Verify you're redirected to dashboard with "upgraded=true"
6. Check Supabase `subscriptions` table - should show your new tier

### Test Usage Limits

1. Try to analyze a URL
2. Check that your monthly limit is enforced
3. Verify PDF export works (Starter and above)
4. Verify API access (Pro and above)

### Test Webhooks

1. In Paddle Dashboard, go to **Developer Tools** → **Events**
2. Find your test transaction
3. Click **Resend** to test webhook handling
4. Check your server logs to see the webhook was processed

---

## Step 8: Switch to Production

When you're ready to go live:

1. Complete Paddle business verification
2. Get production API keys from Paddle Dashboard
3. Create production products and prices (same as sandbox)
4. Update `.env` (or Vercel environment variables):
   ```bash
   PADDLE_ENVIRONMENT=production
   NEXT_PUBLIC_PADDLE_ENVIRONMENT=production
   ```
5. Update webhook URL to your production domain
6. Deploy!

---

## Pricing Tiers Summary

| Tier | Monthly | Annual | Analyses/Month | Features |
|------|---------|--------|----------------|----------|
| **Free** | $0 | $0 | 5 total | Basic scoring, 7-day history |
| **Starter** | $39 | $29/mo | 60 | PDF export, 90-day history |
| **Pro** | $99 | $74/mo | 300 | API access, unlimited history, priority |
| **Enterprise** | $299 | $224/mo | Unlimited | White-label, 5 seats, full API |

---

## Troubleshooting

### "Paddle is not initialized"
- Make sure `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` is set
- Check browser console for script loading errors
- Verify you're using the correct environment (sandbox vs production)

### "Invalid price ID"
- Double-check price IDs in `.env.local` match Paddle Dashboard
- Make sure you're using the right environment (sandbox price IDs won't work in production)

### Webhooks not working
- Verify webhook URL is publicly accessible (use ngrok for local testing)
- Check webhook secret matches in `.env.local`
- Look at Paddle Dashboard → Events → Logs for error details

### User not upgraded after payment
- Check webhook logs in Paddle Dashboard
- Verify `custom_data` is being sent in checkout (userId, tier)
- Check Supabase `subscriptions` table for errors

---

## Migration from Stripe (If Applicable)

If you have existing Stripe customers:

1. **Keep both systems running** temporarily
2. **Don't delete Stripe columns** from database yet
3. **Grandfather existing customers** - let them keep Stripe
4. **New customers** use Paddle
5. **Gradually migrate** by offering incentives to switch

---

## Support

- **Paddle Docs**: https://developer.paddle.com
- **Paddle Support**: support@paddle.com
- **Paddle Community**: https://paddle.com/community

---

## Next Steps

1. ✅ Set up Paddle account
2. ✅ Create products and prices
3. ✅ Configure environment variables
4. ✅ Run database migration
5. ✅ Test with ngrok
6. ✅ Verify checkout flow
7. ✅ Test webhooks
8. 🚀 Deploy to production

You're all set! Your SaaS now has a clean, sustainable pricing structure with Paddle handling all the payment complexity.
