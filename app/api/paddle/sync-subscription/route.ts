import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { paddle } from '@/lib/paddle/server';
import { getTierByPriceId } from '@/lib/paddle-config';

export const dynamic = 'force-dynamic';

/**
 * Manual subscription sync endpoint
 * Use this if webhooks fail or to force a subscription refresh
 */
export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                    set(name: string, value: string, options: any) {
                        cookieStore.set({ name, value, ...options });
                    },
                    remove(name: string, options: any) {
                        cookieStore.set({ name, value: '', ...options });
                    },
                },
            }
        );

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { subscriptionId } = body;

        if (!subscriptionId) {
            return NextResponse.json(
                { error: 'subscriptionId required' },
                { status: 400 }
            );
        }

        console.log('Manual sync requested for subscription:', subscriptionId, 'user:', user.id);

        // Fetch subscription from Paddle
        const subscription = await paddle.subscriptions.get(subscriptionId);

        if (!subscription) {
            return NextResponse.json(
                { error: 'Subscription not found in Paddle' },
                { status: 404 }
            );
        }

        // Get tier from price ID
        const priceId = subscription.items?.[0]?.price?.id;
        const tier = getTierByPriceId(priceId);

        if (!tier) {
            return NextResponse.json(
                { error: 'Could not determine tier from price ID' },
                { status: 400 }
            );
        }

        // Create admin client
        const supabaseAdmin = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                    set(name: string, value: string, options: any) {
                        cookieStore.set({ name, value, ...options });
                    },
                    remove(name: string, options: any) {
                        cookieStore.set({ name, value: '', ...options });
                    },
                },
            }
        );

        // Update subscription in database
        const { error: updateError } = await supabaseAdmin
            .from('subscriptions')
            .upsert({
                user_id: user.id,
                tier: tier.toLowerCase(),
                status: subscription.status === 'trialing' ? 'trialing' : subscription.status,
                paddle_customer_id: subscription.customerId,
                paddle_subscription_id: subscriptionId,
                current_period_start: subscription.currentBillingPeriod?.startsAt || new Date().toISOString(),
                current_period_end: subscription.currentBillingPeriod?.endsAt || null,
                cancel_at_period_end: subscription.scheduledChange?.action === 'cancel',
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id'
            });

        if (updateError) {
            console.error('Error updating subscription:', updateError);
            return NextResponse.json(
                { error: 'Failed to update subscription', details: updateError },
                { status: 500 }
            );
        }

        console.log('Subscription synced successfully for user:', user.id);

        return NextResponse.json({
            success: true,
            subscription: {
                tier: tier.toLowerCase(),
                status: subscription.status,
                subscriptionId,
            },
        });
    } catch (error: any) {
        console.error('Sync subscription error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to sync subscription' },
            { status: 500 }
        );
    }
}
