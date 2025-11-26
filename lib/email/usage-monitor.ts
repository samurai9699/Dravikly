import { createClient } from '@supabase/supabase-js';
import { EmailService } from './service';
import { getMonthlyAnalysesLimit } from '@/lib/paddle-config';

/**
 * Check if user should receive usage warning email
 * Send at 80% and 95% thresholds
 */
export async function checkAndSendUsageWarning(userId: string) {
    try {
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                },
            }
        );

        // Get user subscription
        const { data: subscription } = await supabaseAdmin
            .from('subscriptions')
            .select('tier')
            .eq('user_id', userId)
            .single();

        if (!subscription) {
            return;
        }

        const tier = subscription.tier.toLowerCase();
        const limit = getMonthlyAnalysesLimit(tier as any);

        // Skip for unlimited plans
        if (limit === -1) {
            return;
        }

        // Get current month's usage
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { data: analyses, error } = await supabaseAdmin
            .from('analyses')
            .select('id')
            .eq('user_id', userId)
            .gte('created_at', startOfMonth.toISOString());

        if (error || !analyses) {
            console.error('Error fetching analyses:', error);
            return;
        }

        const currentUsage = analyses.length;
        const percentage = (currentUsage / limit) * 100;

        // Check if we should send warning (at 80% and 95%)
        const shouldSendWarning =
            (percentage >= 80 && percentage < 85) ||
            (percentage >= 95 && percentage < 100);

        if (!shouldSendWarning) {
            return;
        }

        // Check if we already sent a warning this month at this threshold
        const warningKey = percentage >= 95 ? '95' : '80';
        const { data: existingWarning } = await supabaseAdmin
            .from('events')
            .select('id')
            .eq('user_id', userId)
            .eq('event_type', `usage_warning_${warningKey}`)
            .gte('created_at', startOfMonth.toISOString())
            .maybeSingle();

        if (existingWarning) {
            // Already sent warning at this threshold this month
            return;
        }

        // Get user email
        const { data: user } = await supabaseAdmin.auth.admin.getUserById(userId);

        if (!user?.user?.email) {
            return;
        }

        const userName = user.user.user_metadata?.name || user.user.email.split('@')[0];

        // Send warning email
        await EmailService.sendUsageLimitWarningEmail({
            to: user.user.email,
            userName,
            currentUsage,
            limit,
            tier: tier.toUpperCase(),
        });

        // Record that we sent the warning
        await supabaseAdmin
            .from('events')
            .insert({
                user_id: userId,
                event_type: `usage_warning_${warningKey}`,
                metadata: {
                    usage: currentUsage,
                    limit,
                    percentage: Math.round(percentage),
                },
            });

        console.log(`Usage warning sent to user ${userId}: ${currentUsage}/${limit} (${Math.round(percentage)}%)`);
    } catch (error) {
        console.error('Error checking/sending usage warning:', error);
    }
}
