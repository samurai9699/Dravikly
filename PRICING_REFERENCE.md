# Pricing Reference Card

Quick reference for the new Paddle-based pricing structure.

## Pricing Tiers

### 🆓 Free
- **Price**: $0
- **Analyses**: 5 total (lifetime)
- **History**: 7 days
- **Features**:
  - Basic friction score
  - Community support
- **Target**: Testing the product
- **Paddle Price ID**: None (no payment required)

---

### 🚀 Starter
- **Price**: $39/month or $29/month (annual)
- **Annual Savings**: $120/year (25% off)
- **Analyses**: 60/month (~2 per day)
- **History**: 90 days
- **Features**:
  - Full insights + recommendations
  - PDF export ✅
  - Email support
- **Target**: Solo founders, small businesses
- **Paddle Price IDs**:
  - Monthly: `NEXT_PUBLIC_PADDLE_STARTER_MONTHLY_PRICE_ID`
  - Annual: `NEXT_PUBLIC_PADDLE_STARTER_ANNUAL_PRICE_ID`

---

### ⚡ Pro
- **Price**: $99/month or $74/month (annual)
- **Annual Savings**: $300/year (25% off)
- **Analyses**: 300/month (~10 per day)
- **History**: Unlimited
- **Features**:
  - Everything in Starter
  - API access (rate limited) ✅
  - Priority processing ✅
  - Priority support
- **Target**: Agencies, consultants, serious optimizers
- **Paddle Price IDs**:
  - Monthly: `NEXT_PUBLIC_PADDLE_PRO_MONTHLY_PRICE_ID`
  - Annual: `NEXT_PUBLIC_PADDLE_PRO_ANNUAL_PRICE_ID`
- **Most Popular** ⭐

---

### 👑 Enterprise
- **Price**: $299/month or $224/month (annual)
- **Annual Savings**: $900/year (25% off)
- **Analyses**: Unlimited
- **History**: Unlimited
- **Features**:
  - Everything in Pro
  - Full API access ✅
  - White-label reports ✅
  - 5 team seats included
  - Priority support
  - Custom integrations
- **Target**: Agencies, SaaS companies, teams
- **Paddle Price IDs**:
  - Monthly: `NEXT_PUBLIC_PADDLE_ENTERPRISE_MONTHLY_PRICE_ID`
  - Annual: `NEXT_PUBLIC_PADDLE_ENTERPRISE_ANNUAL_PRICE_ID`

---

## Feature Matrix

| Feature | Free | Starter | Pro | Enterprise |
|---------|------|---------|-----|------------|
| **Analyses/Month** | 5 total | 60 | 300 | Unlimited |
| **History** | 7 days | 90 days | Unlimited | Unlimited |
| **Friction Score** | ✅ | ✅ | ✅ | ✅ |
| **Full Insights** | ❌ | ✅ | ✅ | ✅ |
| **PDF Export** | ❌ | ✅ | ✅ | ✅ |
| **API Access** | ❌ | ❌ | ✅ Limited | ✅ Full |
| **Priority Processing** | ❌ | ❌ | ✅ | ✅ |
| **White-label Reports** | ❌ | ❌ | ❌ | ✅ |
| **Team Seats** | 1 | 1 | 1 | 5 |
| **Support** | Community | Email | Priority | Priority |

---

## Cost Analysis

### Per Analysis Cost

Assuming $0.10 per analysis in API costs:

| Tier | Monthly Price | Max Analyses | Cost | Profit | Margin |
|------|--------------|--------------|------|--------|--------|
| Free | $0 | 5 | $0.50 | -$0.50 | Loss leader |
| Starter | $39 | 60 | $6 | $33 | 85% |
| Pro | $99 | 300 | $30 | $69 | 70% |
| Enterprise | $299 | Unlimited* | ~$80 | $219 | 73% |

*Assuming 800 analyses/month average for Enterprise

### Break-even Points

- **Starter**: Profitable after 6 analyses
- **Pro**: Profitable after 30 analyses
- **Enterprise**: Profitable after 300 analyses

---

## Upgrade Paths

### Free → Starter
**Trigger**: User hits 5 analysis limit
**Value Prop**: "Get 60 analyses/month + PDF exports for just $39"
**Conversion Rate Target**: 5-10%

### Starter → Pro
**Trigger**: User consistently uses 50+ analyses/month
**Value Prop**: "5x more analyses + API access for $60 more"
**Conversion Rate Target**: 15-20%

### Pro → Enterprise
**Trigger**: User hits 300 analysis limit or needs white-label
**Value Prop**: "Unlimited analyses + white-label for agencies"
**Conversion Rate Target**: 10-15%

---

## Competitive Positioning

### vs. Hotjar ($39-99/mo)
- ✅ We're priced similarly
- ✅ We offer AI insights (they don't)
- ❌ They have heatmaps (we don't)

### vs. Crazy Egg ($29-249/mo)
- ✅ Our Pro tier is better value
- ✅ We have API access
- ❌ They have more brand recognition

### vs. Manual Audits ($2k-10k)
- ✅ We're 100x cheaper
- ✅ Instant results
- ❌ Less personalized

**Our Position**: Premium AI tool, not the cheapest, not the most expensive.

---

## Pricing Psychology

### Why $39 not $29?
- $29 = "budget tool"
- $39 = "serious investment"
- Only $10 difference but huge perception shift

### Why $99 not $79?
- $99 is the "premium SaaS" price point
- Competitors are at $99
- Agencies expense without thinking

### Why $299 not $199?
- Agencies bill clients $5k-20k/month
- $299 is still a rounding error
- Protects us from unlimited abuse

### Annual Discount (25%)
- Industry standard is 15-20%
- 25% makes annual compelling
- Gets us cash upfront
- Reduces churn

---

## Usage Patterns (Expected)

### Free Users
- 80% never upgrade (that's okay)
- 15% upgrade to Starter
- 5% upgrade to Pro directly

### Starter Users
- Average: 30-40 analyses/month (50% utilization)
- 20% upgrade to Pro within 3 months
- 60% stay on Starter long-term
- 20% churn

### Pro Users
- Average: 150-200 analyses/month (60% utilization)
- 10% upgrade to Enterprise
- 80% stay on Pro long-term
- 10% churn

### Enterprise Users
- Average: 500-800 analyses/month
- 95% retention (high value customers)
- Often negotiate custom pricing above $299

---

## Revenue Projections

### Conservative (Year 1)
- 1,000 free users
- 50 Starter users ($1,950/mo)
- 20 Pro users ($1,980/mo)
- 5 Enterprise users ($1,495/mo)
- **Total MRR**: $5,425
- **Annual**: $65,100

### Moderate (Year 1)
- 5,000 free users
- 250 Starter users ($9,750/mo)
- 100 Pro users ($9,900/mo)
- 20 Enterprise users ($5,980/mo)
- **Total MRR**: $25,630
- **Annual**: $307,560

### Optimistic (Year 1)
- 10,000 free users
- 500 Starter users ($19,500/mo)
- 200 Pro users ($19,800/mo)
- 50 Enterprise users ($14,950/mo)
- **Total MRR**: $54,250
- **Annual**: $651,000

---

## Key Metrics to Track

### Conversion Rates
- Free → Paid: Target 5%
- Starter → Pro: Target 15%
- Pro → Enterprise: Target 10%

### Churn Rates
- Starter: Target <20%/year
- Pro: Target <15%/year
- Enterprise: Target <10%/year

### Usage Metrics
- Average analyses per user per tier
- % of users hitting limits
- Time to first upgrade

### Revenue Metrics
- MRR (Monthly Recurring Revenue)
- ARR (Annual Recurring Revenue)
- ARPU (Average Revenue Per User)
- LTV (Lifetime Value)
- CAC (Customer Acquisition Cost)

---

## Pricing Experiments to Try

### After Launch

1. **Founding Member Discount**
   - First 100 customers: 50% off forever
   - Creates urgency and loyalty

2. **Annual-Only Starter**
   - $199/year ($16.58/mo) Starter plan
   - Captures price-sensitive users

3. **Usage-Based Add-ons**
   - Extra analyses: $0.50 each
   - Extra team seats: $30/seat/month

4. **Enterprise Custom Pricing**
   - Start negotiations at $499/mo
   - Volume discounts for 1000+ analyses

---

## When to Raise Prices

### Don't raise prices if:
- You have <100 paying customers
- Churn is >25%
- You're still finding product-market fit

### Raise prices when:
- You have 200+ paying customers
- Churn is <15%
- You have testimonials and case studies
- Competitors are priced higher
- You're adding significant new features

### How to raise prices:
- Grandfather existing customers (keep their current price)
- Announce 30 days in advance
- Offer annual lock-in at old price
- Raise by 20-30% max at once

---

## Summary

This pricing structure is:
- ✅ **Sustainable**: Healthy margins from day one
- ✅ **Competitive**: Priced in line with market
- ✅ **Scalable**: Clear upgrade path
- ✅ **Flexible**: Room for experiments
- ✅ **Simple**: Easy to understand

**No changes needed for at least 12 months.**

Focus on getting customers, not tweaking prices.
