export const FREE_TIER = null;
export const PRO_TIER = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_xxx';
export const ULTRA_TIER = process.env.NEXT_PUBLIC_STRIPE_ULTRA_PRICE_ID || 'price_yyy';

export type TierName = 'free' | 'pro' | 'ultra';

export interface TierLimits {
  analyses_per_day: number;
  features: string[];
}

export const TIER_LIMITS: Record<TierName, TierLimits> = {
  free: {
    analyses_per_day: 3,
    features: ['basic'],
  },
  pro: {
    analyses_per_day: 20,
    features: ['basic', 'pdf', 'deep'],
  },
  ultra: {
    analyses_per_day: -1,
    features: ['all'],
  },
};

export const TIER_NAMES: Record<TierName, string> = {
  free: 'Free',
  pro: 'Pro',
  ultra: 'Ultra',
};

export const TIER_PRICES: Record<TierName, string | null> = {
  free: FREE_TIER,
  pro: PRO_TIER,
  ultra: ULTRA_TIER,
};

export function getTierLimits(tier: TierName): TierLimits {
  return TIER_LIMITS[tier];
}

export function getTierName(tier: TierName): string {
  return TIER_NAMES[tier];
}

export function getTierPrice(tier: TierName): string | null {
  return TIER_PRICES[tier];
}

export function hasFeature(tier: TierName, feature: string): boolean {
  const limits = getTierLimits(tier);
  return limits.features.includes('all') || limits.features.includes(feature);
}

export function isUnlimitedAnalyses(tier: TierName): boolean {
  return getTierLimits(tier).analyses_per_day === -1;
}
