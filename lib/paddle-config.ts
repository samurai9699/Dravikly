// Paddle Configuration and Pricing Tiers
// This is the single source of truth for pricing across the app

export type TierName = 'free' | 'starter' | 'pro' | 'enterprise';

export interface TierLimits {
    analyses_per_month: number; // -1 means unlimited
    features: string[];
    history_days: number; // -1 means unlimited
    pdf_export: boolean;
    api_access: boolean;
    priority_processing: boolean;
    white_label: boolean;
    team_seats: number;
}

export interface PricingTier {
    id: TierName;
    name: string;
    description: string;
    monthlyPrice: number;
    annualPrice: number; // Annual price per month (25% discount)
    paddleMonthlyPriceId: string | null;
    paddleAnnualPriceId: string | null;
    limits: TierLimits;
    features: string[]; // Display features for pricing page
    highlighted: boolean;
    popular: boolean;
}

// Paddle Price IDs - Set these from your Paddle dashboard
// For sandbox testing, use sandbox price IDs
export const PADDLE_PRICE_IDS = {
    starter: {
        monthly: process.env.NEXT_PUBLIC_PADDLE_STARTER_MONTHLY_PRICE_ID || 'pri_starter_monthly',
        annual: process.env.NEXT_PUBLIC_PADDLE_STARTER_ANNUAL_PRICE_ID || 'pri_starter_annual',
    },
    pro: {
        monthly: process.env.NEXT_PUBLIC_PADDLE_PRO_MONTHLY_PRICE_ID || 'pri_pro_monthly',
        annual: process.env.NEXT_PUBLIC_PADDLE_PRO_ANNUAL_PRICE_ID || 'pri_pro_annual',
    },
    enterprise: {
        monthly: process.env.NEXT_PUBLIC_PADDLE_ENTERPRISE_MONTHLY_PRICE_ID || 'pri_enterprise_monthly',
        annual: process.env.NEXT_PUBLIC_PADDLE_ENTERPRISE_ANNUAL_PRICE_ID || 'pri_enterprise_annual',
    },
};

// Pricing Tiers Configuration
export const PRICING_TIERS: Record<TierName, PricingTier> = {
    free: {
        id: 'free',
        name: 'Free',
        description: 'Perfect for testing',
        monthlyPrice: 0,
        annualPrice: 0,
        paddleMonthlyPriceId: null,
        paddleAnnualPriceId: null,
        limits: {
            analyses_per_month: 5, // 5 total analyses
            features: ['basic'],
            history_days: 7,
            pdf_export: false,
            api_access: false,
            priority_processing: false,
            white_label: false,
            team_seats: 1,
        },
        features: [
            '5 analyses total',
            'Basic friction score',
            '7-day history',
            'Community support',
        ],
        highlighted: false,
        popular: false,
    },
    starter: {
        id: 'starter',
        name: 'Starter',
        description: 'For solo founders',
        monthlyPrice: 39,
        annualPrice: 29, // $348/year = $29/month
        paddleMonthlyPriceId: PADDLE_PRICE_IDS.starter.monthly,
        paddleAnnualPriceId: PADDLE_PRICE_IDS.starter.annual,
        limits: {
            analyses_per_month: 60,
            features: ['basic', 'pdf', 'insights'],
            history_days: 90,
            pdf_export: true,
            api_access: false,
            priority_processing: false,
            white_label: false,
            team_seats: 1,
        },
        features: [
            '60 analyses/month',
            'Full insights + recommendations',
            '90-day history',
            'PDF export',
            'Email support',
        ],
        highlighted: false,
        popular: false,
    },
    pro: {
        id: 'pro',
        name: 'Pro',
        description: 'For agencies & consultants',
        monthlyPrice: 99,
        annualPrice: 74, // $888/year = $74/month
        paddleMonthlyPriceId: PADDLE_PRICE_IDS.pro.monthly,
        paddleAnnualPriceId: PADDLE_PRICE_IDS.pro.annual,
        limits: {
            analyses_per_month: 300,
            features: ['all'],
            history_days: -1, // unlimited
            pdf_export: true,
            api_access: true,
            priority_processing: true,
            white_label: false,
            team_seats: 1,
        },
        features: [
            '300 analyses/month',
            'Everything in Starter',
            'Unlimited history',
            'Priority processing',
            'API access (Coming Soon)',
            'Priority support',
        ],
        highlighted: true,
        popular: true,
    },
    enterprise: {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'For teams & agencies',
        monthlyPrice: 299,
        annualPrice: 224, // $2,688/year = $224/month
        paddleMonthlyPriceId: PADDLE_PRICE_IDS.enterprise.monthly,
        paddleAnnualPriceId: PADDLE_PRICE_IDS.enterprise.annual,
        limits: {
            analyses_per_month: -1, // unlimited
            features: ['all'],
            history_days: -1, // unlimited
            pdf_export: true,
            api_access: true,
            priority_processing: true,
            white_label: true,
            team_seats: 5,
        },
        features: [
            'Unlimited analyses',
            'Everything in Pro',
            'Full API access(Coming Soon)',
            'White-label reports(Coming Soon)',
            '5 team seats included(Coming Soon)',
            'Priority support',
            'Custom integrations(Coming Soon)',
        ],
        highlighted: false,
        popular: false,
    },
};

// Helper Functions
export function getTierConfig(tier: TierName): PricingTier {
    return PRICING_TIERS[tier];
}

export function getTierLimits(tier: TierName): TierLimits {
    return PRICING_TIERS[tier].limits;
}

export function hasFeature(tier: TierName, feature: string): boolean {
    const limits = getTierLimits(tier);
    return limits.features.includes('all') || limits.features.includes(feature);
}

export function isUnlimitedAnalyses(tier: TierName): boolean {
    return getTierLimits(tier).analyses_per_month === -1;
}

export function getPriceIdForTier(tier: TierName, billingCycle: 'monthly' | 'annual'): string | null {
    const config = getTierConfig(tier);
    return billingCycle === 'annual' ? config.paddleAnnualPriceId : config.paddleMonthlyPriceId;
}

export function getTierByPriceId(priceId: string): TierName | null {
    for (const [tierName, config] of Object.entries(PRICING_TIERS)) {
        if (config.paddleMonthlyPriceId === priceId || config.paddleAnnualPriceId === priceId) {
            return tierName as TierName;
        }
    }
    return null;
}

// Calculate monthly analyses from daily limit (for backward compatibility)
export function getMonthlyAnalysesLimit(tier: TierName): number {
    return getTierLimits(tier).analyses_per_month;
}

// Get price details for email templates
export function getPriceDetails(tier: string): { monthly: string; annual: string } {
    const tierName = tier.toLowerCase() as TierName;
    const config = PRICING_TIERS[tierName];

    if (!config) {
        return { monthly: '$0', annual: '$0' };
    }

    return {
        monthly: `$${config.monthlyPrice}`,
        annual: `$${config.annualPrice * 12}`,
    };
}
