# Dravikly - AI-Powered Customer Friction Detector

> Analyze your conversion funnels and detect friction points with AI-powered insights.

Dravikly uses advanced AI to analyze your landing pages, signup forms, and checkout flows to identify exactly what's preventing users from converting. Get actionable recommendations to eliminate friction and boost conversions.

---

## Features

### Core Features
- **AI Friction Analysis** - Analyze any URL for conversion-killing friction points
- **Smart Insights** - Get AI-powered recommendations to fix issues
- **Friction Scoring** - 0-100 score showing how much friction exists
- **Historical Tracking** - View all past analyses and track improvements over time

### Subscription Tiers
- **FREE** - 3 analyses per day, basic insights
- **PRO** - 20 analyses per day, PDF exports, full history access
- **ULTRA** - Unlimited analyses, competitive benchmarking, API access, priority support

### Advanced Features
- **PDF Export** - Download professional reports to share with your team
- **Usage Analytics** - Track your analysis history and patterns
- **Responsive Design** - Beautiful UI that works on all devices
- **Dark Mode** - Eye-friendly interface with Norse-inspired patterns

---

## Quick Start

### Prerequisites
- Node.js 18+ installed
- Supabase account (free tier works)
- OpenRouter API key (for AI analysis)
- Stripe account (for paid subscriptions)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd frictionkiller
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

4. **Configure environment variables** (see section below)

5. **Set up Supabase database** (see Supabase Setup section)

6. **Run the development server**
```bash
npm run dev
```

7. **Open your browser**
```
http://localhost:3000
```

---

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Supabase Configuration
```bash
# Supabase Project URL (from your Supabase dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# Supabase Anonymous Key (from your Supabase dashboard → Settings → API)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Supabase Service Role Key (from your Supabase dashboard → Settings → API)
# ⚠️ Keep this secret! Never commit to git or expose to client
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```


### OpenRouter Configuration
```bash
# OpenRouter API Key (from https://openrouter.ai/keys)
OPENROUTER_API_KEY=sk-or-v1-...
```

### Application Configuration
```bash
# Your application URL (for OAuth redirects and email links)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Admin email (optional, for support/notifications)
ADMIN_EMAIL=admin@yourapp.com
```

---

## Supabase Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details
4. Wait for project to initialize

### 2. Run Database Migrations

Copy and run these SQL commands in your Supabase SQL Editor (Dashboard → SQL Editor):

#### Migration 1: Create Subscriptions Table
```sql
/*
  # Create Subscriptions Table

  1. New Tables
    - `subscriptions`
      - `id` (uuid, primary key) - Unique identifier for subscription
      - `user_id` (uuid, foreign key) - References auth.users
      - `tier` (text) - Subscription tier: FREE, PRO, ULTRA
      - `status` (text) - Subscription status: active, cancelled, past_due
      - `stripe_customer_id` (text, nullable) - Stripe customer ID
      - `stripe_subscription_id` (text, nullable) - Stripe subscription ID
      - `current_period_start` (timestamptz, nullable) - Current billing period start
      - `current_period_end` (timestamptz, nullable) - Current billing period end
      - `cancel_at_period_end` (boolean) - Whether to cancel at period end
      - `analyses_used_today` (integer) - Daily analyses counter
      - `last_reset_date` (date) - Last date counter was reset
      - `created_at` (timestamptz) - Subscription creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `subscriptions` table
    - Add policy for users to read their own subscription
    - Add policy for users to update their own subscription (limited fields)
*/

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier text NOT NULL DEFAULT 'FREE' CHECK (tier IN ('FREE', 'PRO', 'ULTRA')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  analyses_used_today integer DEFAULT 0,
  last_reset_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

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

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
```

#### Migration 2: Create Analyses Table
```sql
/*
  # Create Analyses Table

  1. New Tables
    - `analyses`
      - `id` (uuid, primary key) - Unique identifier for analysis
      - `user_id` (uuid, foreign key) - References auth.users
      - `url` (text) - The URL that was analyzed
      - `status` (text) - Analysis status: pending, processing, completed, failed
      - `friction_score` (integer, nullable) - Overall friction score (0-100)
      - `insights` (jsonb, nullable) - AI-generated insights and recommendations
      - `created_at` (timestamptz) - Analysis creation timestamp
      - `completed_at` (timestamptz, nullable) - Analysis completion timestamp

  2. Security
    - Enable RLS on `analyses` table
    - Add policy for users to view their own analyses
    - Add policy for users to create their own analyses
    - Add policy for users to update their own analyses (for status updates)
*/

CREATE TABLE IF NOT EXISTS analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  friction_score integer CHECK (friction_score >= 0 AND friction_score <= 100),
  insights jsonb,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analyses"
  ON analyses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own analyses"
  ON analyses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analyses"
  ON analyses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analyses_status ON analyses(status);
```

#### Migration 3: Create Events Table
```sql
/*
  # Create Events Table

  1. New Tables
    - `events`
      - `id` (uuid, primary key) - Unique event identifier
      - `user_id` (uuid, foreign key) - References auth.users
      - `event_type` (text) - Type of event (analysis_started, analysis_completed, etc.)
      - `metadata` (jsonb) - Flexible JSON field for event-specific data
      - `created_at` (timestamptz) - When the event occurred

  2. Security
    - Enable RLS on `events` table
    - Add policy for authenticated users to insert their own events
    - Add policy for authenticated users to read their own events
*/

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_type text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own events"
  ON events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS events_user_id_idx ON events(user_id);
CREATE INDEX IF NOT EXISTS events_event_type_idx ON events(event_type);
CREATE INDEX IF NOT EXISTS events_created_at_idx ON events(created_at DESC);
CREATE INDEX IF NOT EXISTS events_user_event_type_idx ON events(user_id, event_type);
```

### 3. Enable Email Authentication

1. Go to Authentication → Providers
2. Enable "Email" provider
3. Configure email templates (optional)
4. Disable email confirmation for faster testing (optional)

### 4. Get API Keys

1. Go to Settings → API
2. Copy your Project URL → Add to `NEXT_PUBLIC_SUPABASE_URL`
3. Copy your anon/public key → Add to `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copy your service_role key → Add to `SUPABASE_SERVICE_ROLE_KEY`

---

## Stripe Setup

### 1. Create Stripe Account
1. Sign up at [stripe.com](https://stripe.com)
2. Activate your account
3. Get your API keys from Developers → API keys

### 2. Create Products and Prices

**PRO Plan:**
1. Go to Products → Add Product
2. Name: "FrictionKiller Pro"
3. Pricing: Recurring, Monthly, $29/month
4. Copy the Price ID → Add to `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`

**ULTRA Plan:**
1. Go to Products → Add Product
2. Name: "FrictionKiller Ultra"
3. Pricing: Recurring, Monthly, $99/month
4. Copy the Price ID → Add to `NEXT_PUBLIC_STRIPE_ULTRA_PRICE_ID`

### 3. Set Up Webhook

1. Go to Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-domain.com/api/webhooks/stripe`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the Signing Secret → Add to `STRIPE_WEBHOOK_SECRET`

### 4. Test Webhook Locally (Development)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy the webhook signing secret to your .env.local
```

---

## OpenRouter Setup

### 1. Create OpenRouter Account
1. Go to [openrouter.ai](https://openrouter.ai)
2. Sign up with your email
3. Add credits to your account ($5 minimum recommended)

### 2. Get API Key
1. Go to [Keys](https://openrouter.ai/keys)
2. Create new key
3. Copy key → Add to `OPENROUTER_API_KEY`

### 3. Recommended Models
The app uses these models by default:
- **GPT-4 Turbo** - For complex friction analysis
- **Claude 3.5 Sonnet** - For detailed recommendations
- Cost: ~$0.10 per analysis

---

## Deployment

### Deploy to Vercel (Recommended)

1. **Push code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo>
git push -u origin main
```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   - Add all environment variables from your `.env.local`
   - ⚠️ Use production values for Stripe, Supabase URLs
   - Set `NEXT_PUBLIC_APP_URL` to your Vercel domain

4. **Update Supabase Settings**
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add your Vercel domain to "Site URL"
   - Add `https://your-domain.vercel.app/**` to "Redirect URLs"

5. **Update Stripe Webhook**
   - Go to Stripe Dashboard → Webhooks
   - Update endpoint URL to `https://your-domain.vercel.app/api/webhooks/stripe`

6. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Visit your site!

### Deploy to Other Platforms

The app is a standard Next.js 13+ app and can be deployed to:
- **Netlify** - Similar to Vercel, auto-detect Next.js
- **Railway** - Connect GitHub, set environment variables
- **Render** - Deploy as Node.js app
- **DigitalOcean App Platform** - Deploy from GitHub

**Requirements:**
- Node.js 18+
- Build command: `npm run build`
- Start command: `npm start`
- All environment variables configured

---

## Project Structure

```
frictionkiller/
├── app/                          # Next.js 13+ App Router
│   ├── api/                      # API routes
│   │   ├── analyze/             # Analysis endpoint
│   │   ├── create-checkout/     # Stripe checkout
│   │   ├── webhooks/            # Stripe webhooks
│   │   └── ...
│   ├── dashboard/               # Dashboard pages
│   │   ├── analyze/             # Analysis form
│   │   ├── history/             # Analysis history
│   │   ├── settings/            # User settings
│   │   └── results/[id]/        # Analysis results
│   ├── login/                   # Login page
│   ├── signup/                  # Signup page
│   ├── pricing/                 # Pricing page
│   ├── error.tsx                # Global error page
│   ├── not-found.tsx            # 404 page
│   └── layout.tsx               # Root layout
├── components/                   # React components
│   ├── ui/                      # Shadcn UI components
│   ├── dashboard/               # Dashboard-specific components
│   ├── ErrorBoundary.tsx        # Error boundary
│   └── upgrade-modal.tsx        # Upgrade modal
├── lib/                         # Utility functions
│   ├── api/                     # API clients
│   ├── stripe/                  # Stripe utilities
│   ├── supabase/                # Supabase clients
│   └── utils.ts                 # Helper functions
├── supabase/
│   └── migrations/              # Database migrations
├── styles/
│   └── globals.css              # Global styles
├── public/                      # Static assets
├── .env.local                   # Environment variables (create this)
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
└── package.json                 # Dependencies
```

---

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type check
npm run typecheck
```

### Tech Stack

- **Framework:** Next.js 13+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Payments:** Stripe
- **AI:** OpenRouter API
- **Deployment:** Vercel

### Key Libraries

- `@supabase/ssr` - Supabase SSR support
- `@stripe/stripe-js` - Stripe client
- `stripe` - Stripe Node.js SDK
- `jspdf` - PDF generation
- `lucide-react` - Icons
- `sonner` - Toast notifications
- `recharts` - Analytics charts

---

## Features in Detail

### AI Friction Analysis

The app analyzes URLs for common friction points:
- **Form Complexity** - Too many fields, unclear labels
- **Trust Signals** - Missing security badges, testimonials
- **Page Load Speed** - Slow loading times
- **Mobile Responsiveness** - Mobile usability issues
- **CTA Quality** - Button placement, text clarity

### Subscription Management

**FREE Tier:**
- 3 analyses per day
- Basic friction scoring
- 7-day history retention

**PRO Tier ($29/mo):**
- 20 analyses per day
- Detailed insights
- PDF export
- Full history access
- Priority support

**ULTRA Tier ($99/mo):**
- Unlimited analyses
- Competitive benchmarking
- API access
- White-label reports
- Priority processing

### Security Features

- **Row Level Security (RLS)** - Users can only access their own data
- **Email/Password Auth** - Secure authentication via Supabase
- **API Key Protection** - Server-side only access to secrets
- **Stripe Webhook Verification** - Secure payment webhooks
- **HTTPS Required** - Secure connections in production

---

## Troubleshooting

### Common Issues

**"Supabase connection failed"**
- Check your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Verify your Supabase project is active
- Check if RLS policies are correctly set up

**"Stripe checkout not working"**
- Verify `STRIPE_SECRET_KEY` is correct
- Check Price IDs match your Stripe products
- Ensure webhook endpoint is reachable

**"OpenRouter API error"**
- Check your API key has credits
- Verify `OPENROUTER_API_KEY` is set correctly
- Check OpenRouter dashboard for errors

**"Analysis stuck in processing"**
- Check OpenRouter API logs
- Verify the URL is publicly accessible
- Check server logs for errors

### Debug Mode

Enable debug logging:
```bash
# Add to .env.local
NODE_ENV=development
```

Check logs:
- Browser Console for client errors
- Terminal for server errors
- Vercel Dashboard → Logs for production

---

## Support

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Issues
Found a bug? [Open an issue](https://github.com/your-repo/issues)

### Community
- [Discord](https://discord.gg/your-server)
- [Twitter](https://twitter.com/your-handle)

---

## License

MIT License - see LICENSE file for details

---

## Credits

Built with:
- [Next.js](https://nextjs.org)
- [Supabase](https://supabase.com)
- [Stripe](https://stripe.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn/ui](https://ui.shadcn.com)
- [OpenRouter](https://openrouter.ai)

---

**Ready to eliminate friction and boost conversions? Get started now! 🚀**
