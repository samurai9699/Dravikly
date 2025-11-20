import { createClient } from '@supabase/supabase-js';
import { getTierLimits, isUnlimitedAnalyses, TierName } from './stripe-config';
import { Database } from './types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export interface UserSubscription {
  tier: TierName;
  status: string;
  current_period_end: string | null;
}

export interface UsageCheck {
  allowed: boolean;
  remaining: number;
  limit: number;
  tier: TierName;
}

export async function getUserTier(userId: string): Promise<UserSubscription | null> {
  try {
    const { data: subscription, error } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user subscription:', error);
      return null;
    }

    if (!subscription) {
      return {
        tier: 'free',
        status: 'active',
        current_period_end: null,
      };
    }

    const sub = subscription as any;

    return {
      tier: sub.tier as TierName,
      status: sub.status,
      current_period_end: sub.current_period_end,
    };
  } catch (error) {
    console.error('Error in getUserTier:', error);
    return null;
  }
}

export async function checkDailyUsageLimit(userId: string): Promise<UsageCheck> {
  try {
    const subscription = await getUserTier(userId);

    if (!subscription) {
      return {
        allowed: false,
        remaining: 0,
        limit: 0,
        tier: 'free',
      };
    }

    const tier = subscription.tier;
    const limits = getTierLimits(tier);

    if (isUnlimitedAnalyses(tier)) {
      return {
        allowed: true,
        remaining: -1,
        limit: -1,
        tier,
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count, error } = await supabaseAdmin
      .from('analyses')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', today.toISOString());

    if (error) {
      console.error('Error checking usage:', error);
      return {
        allowed: false,
        remaining: 0,
        limit: limits.analyses_per_day,
        tier,
      };
    }

    const usedToday = count || 0;
    const remaining = Math.max(0, limits.analyses_per_day - usedToday);
    const allowed = usedToday < limits.analyses_per_day;

    return {
      allowed,
      remaining,
      limit: limits.analyses_per_day,
      tier,
    };
  } catch (error) {
    console.error('Error in checkDailyUsageLimit:', error);
    return {
      allowed: false,
      remaining: 0,
      limit: 0,
      tier: 'free',
    };
  }
}

export async function incrementUsageCounter(
  userId: string,
  url: string,
  results: any
): Promise<{ success: boolean; error?: string }> {
  try {
    const usageCheck = await checkDailyUsageLimit(userId);

    if (!usageCheck.allowed) {
      return {
        success: false,
        error: 'Daily usage limit exceeded',
      };
    }

    const { error } = await (supabaseAdmin
      .from('analyses') as any)
      .insert({
        user_id: userId,
        url,
        results,
      });

    if (error) {
      console.error('Error incrementing usage:', error);
      return {
        success: false,
        error: 'Failed to record analysis',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in incrementUsageCounter:', error);
    return {
      success: false,
      error: 'Internal error',
    };
  }
}

export async function getTodayUsageCount(userId: string): Promise<number> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count, error } = await supabaseAdmin
      .from('analyses')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', today.toISOString());

    if (error) {
      console.error('Error getting usage count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error in getTodayUsageCount:', error);
    return 0;
  }
}

export async function getUserAnalysisHistory(
  userId: string,
  limit: number = 10
): Promise<any[]> {
  try {
    const { data: analyses, error } = await supabaseAdmin
      .from('analyses')
      .select('id, url, results, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching analysis history:', error);
      return [];
    }

    return analyses || [];
  } catch (error) {
    console.error('Error in getUserAnalysisHistory:', error);
    return [];
  }
}
