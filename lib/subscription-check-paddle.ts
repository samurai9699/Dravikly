// Subscription checking and usage limits with Paddle
import { createClient } from '@supabase/supabase-js';
import { getTierLimits, isUnlimitedAnalyses, TierName } from './paddle-config';
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
    paddle_subscription_id: string | null;
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
            // No subscription record = free tier
            return {
                tier: 'free',
                status: 'active',
                current_period_end: null,
                paddle_subscription_id: null,
            };
        }

        const sub = subscription as any;

        return {
            tier: (sub.tier?.toLowerCase() || 'free') as TierName,
            status: sub.status || 'active',
            current_period_end: sub.current_period_end,
            paddle_subscription_id: sub.paddle_subscription_id,
        };
    } catch (error) {
        console.error('Error in getUserTier:', error);
        return null;
    }
}

export async function checkMonthlyUsageLimit(userId: string): Promise<UsageCheck> {
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

        // Unlimited analyses
        if (isUnlimitedAnalyses(tier)) {
            return {
                allowed: true,
                remaining: -1,
                limit: -1,
                tier,
            };
        }

        // Get start of current month
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const { count, error } = await supabaseAdmin
            .from('analyses')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId)
            .gte('created_at', monthStart.toISOString());

        if (error) {
            console.error('Error checking usage:', error);
            return {
                allowed: false,
                remaining: 0,
                limit: limits.analyses_per_month,
                tier,
            };
        }

        const usedThisMonth = count || 0;
        const remaining = Math.max(0, limits.analyses_per_month - usedThisMonth);
        const allowed = usedThisMonth < limits.analyses_per_month;

        return {
            allowed,
            remaining,
            limit: limits.analyses_per_month,
            tier,
        };
    } catch (error) {
        console.error('Error in checkMonthlyUsageLimit:', error);
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
        const usageCheck = await checkMonthlyUsageLimit(userId);

        if (!usageCheck.allowed) {
            return {
                success: false,
                error: 'Monthly usage limit exceeded. Please upgrade your plan.',
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

export async function getMonthUsageCount(userId: string): Promise<number> {
    try {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const { count, error } = await supabaseAdmin
            .from('analyses')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId)
            .gte('created_at', monthStart.toISOString());

        if (error) {
            console.error('Error getting usage count:', error);
            return 0;
        }

        return count || 0;
    } catch (error) {
        console.error('Error in getMonthUsageCount:', error);
        return 0;
    }
}

export async function getUserAnalysisHistory(
    userId: string,
    limit: number = 10
): Promise<any[]> {
    try {
        const subscription = await getUserTier(userId);
        if (!subscription) return [];

        const tierLimits = getTierLimits(subscription.tier);

        // Check history access based on tier
        let query = supabaseAdmin
            .from('analyses')
            .select('id, url, results, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        // Apply history day limits
        if (tierLimits.history_days > 0) {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - tierLimits.history_days);
            query = query.gte('created_at', cutoffDate.toISOString());
        }

        const { data: analyses, error } = await query.limit(limit);

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

export async function canExportPDF(userId: string): Promise<boolean> {
    const subscription = await getUserTier(userId);
    if (!subscription) return false;

    const limits = getTierLimits(subscription.tier);
    return limits.pdf_export;
}

export async function hasAPIAccess(userId: string): Promise<boolean> {
    const subscription = await getUserTier(userId);
    if (!subscription) return false;

    const limits = getTierLimits(subscription.tier);
    return limits.api_access;
}

export async function hasPriorityProcessing(userId: string): Promise<boolean> {
    const subscription = await getUserTier(userId);
    if (!subscription) return false;

    const limits = getTierLimits(subscription.tier);
    return limits.priority_processing;
}
