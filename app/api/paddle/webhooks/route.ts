import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { paddle } from '@/lib/paddle/server';
import { getTierByPriceId, getPriceDetails } from '@/lib/paddle-config';
import { EmailService } from '@/lib/email/service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        // Get the raw body for signature verification
        const body = await request.text();
        const signature = request.headers.get('paddle-signature');

        if (!signature) {
            console.error('No Paddle signature found');
            return NextResponse.json(
                { error: 'No signature' },
                { status: 400 }
            );
        }

        // Verify webhook signature
        const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;
        if (!webhookSecret) {
            console.error('PADDLE_WEBHOOK_SECRET not configured');
            return NextResponse.json(
                { error: 'Webhook secret not configured' },
                { status: 503 }
            );
        }

        // Parse the event
        let event: any;
        try {
            event = JSON.parse(body);
        } catch (err) {
            console.error('Failed to parse webhook body:', err);
            return NextResponse.json(
                { error: 'Invalid JSON' },
                { status: 400 }
            );
        }

        // Verify the signature using Paddle SDK
        // The signature header contains: ts=timestamp;h1=signature

        // TEMPORARY: Skip signature verification for debugging
        // TODO: Remove this after fixing signature issue
        const SKIP_SIGNATURE_VERIFICATION = process.env.SKIP_WEBHOOK_SIGNATURE === 'true';

        if (!SKIP_SIGNATURE_VERIFICATION) {
            const isValid = verifyPaddleSignature(body, signature, webhookSecret);

            if (!isValid) {
                console.error('Invalid Paddle signature - webhook rejected');
                return NextResponse.json(
                    { error: 'Invalid signature' },
                    { status: 400 }
                );
            }
        } else {
            console.warn('⚠️ SIGNATURE VERIFICATION SKIPPED - FOR TESTING ONLY');
        }

        console.log('Paddle webhook event received:', event.event_type);

        // Handle different event types
        switch (event.event_type) {
            case 'transaction.completed':
                await handleTransactionCompleted(event.data);
                break;

            case 'subscription.created':
                await handleSubscriptionCreated(event.data);
                break;

            case 'subscription.updated':
                await handleSubscriptionUpdated(event.data);
                break;

            case 'subscription.canceled':
            case 'subscription.paused':
                await handleSubscriptionCanceled(event.data);
                break;

            default:
                console.log(`Unhandled event type: ${event.event_type}`);
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        );
    }
}

// Verify Paddle webhook signature
function verifyPaddleSignature(body: string, signature: string, secret: string): boolean {
    try {
        const crypto = require('crypto');

        console.log('Verifying signature:', {
            signatureHeader: signature,
            secretLength: secret?.length,
            secretPrefix: secret?.substring(0, 10),
            bodyLength: body.length
        });

        // Parse signature header: ts=timestamp;h1=signature
        const parts = signature.split(';');
        const timestamp = parts.find(p => p.startsWith('ts='))?.split('=')[1];
        const signatureHash = parts.find(p => p.startsWith('h1='))?.split('=')[1];

        if (!timestamp || !signatureHash) {
            console.error('Missing timestamp or signature hash in header');
            return false;
        }

        console.log('Parsed signature parts:', { timestamp, signatureHashLength: signatureHash.length });

        // Create the signed payload
        const signedPayload = `${timestamp}:${body}`;

        // Calculate expected signature
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(signedPayload)
            .digest('hex');

        console.log('Signature comparison:', {
            received: signatureHash.substring(0, 20) + '...',
            expected: expectedSignature.substring(0, 20) + '...',
            match: signatureHash === expectedSignature
        });

        // Compare signatures
        return crypto.timingSafeEqual(
            Buffer.from(signatureHash),
            Buffer.from(expectedSignature)
        );
    } catch (error) {
        console.error('Signature verification error:', error);
        return false;
    }
}

async function handleTransactionCompleted(data: any) {
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

        const userId = data.custom_data?.userId;
        const tier = data.custom_data?.tier;
        const customerId = data.customer_id;
        const subscriptionId = data.subscription_id;

        console.log('Transaction completed:', {
            transactionId: data.id,
            userId,
            tier,
            customerId,
            subscriptionId,
            status: data.status
        });

        if (!userId || !tier) {
            console.error('Missing custom data in transaction:', data.id, 'Data:', data);
            // Try to find user by customer_id as fallback
            if (customerId) {
                const { data: existingSub } = await supabaseAdmin
                    .from('subscriptions')
                    .select('user_id')
                    .eq('paddle_customer_id', customerId)
                    .maybeSingle();

                if (existingSub) {
                    console.log('Found existing subscription for customer:', customerId);
                    // Continue with the existing user
                } else {
                    console.error('Cannot process transaction without userId');
                    return;
                }
            } else {
                return;
            }
        }

        // For one-time payments, subscription_id might be null
        if (subscriptionId) {
            // This is a subscription payment
            const subscription = await paddle.subscriptions.get(subscriptionId);

            // Calculate period end - if Paddle's date seems wrong, calculate it ourselves
            let periodEnd = subscription.currentBillingPeriod?.endsAt;
            const periodStart = subscription.currentBillingPeriod?.startsAt || new Date().toISOString();

            // If no end date or it seems wrong (before start date), calculate it
            if (!periodEnd || new Date(periodEnd) <= new Date(periodStart)) {
                const startDate = new Date(periodStart);
                // Add 1 month for monthly subscriptions
                startDate.setMonth(startDate.getMonth() + 1);
                periodEnd = startDate.toISOString();
            }

            const { error } = await supabaseAdmin
                .from('subscriptions')
                .upsert({
                    user_id: userId,
                    tier: tier.toLowerCase(),
                    status: subscription.status === 'trialing' ? 'trialing' : 'active',
                    paddle_customer_id: customerId,
                    paddle_subscription_id: subscriptionId,
                    current_period_start: periodStart,
                    current_period_end: periodEnd,
                    cancel_at_period_end: subscription.scheduledChange?.action === 'cancel',
                    updated_at: new Date().toISOString(),
                }, {
                    onConflict: 'user_id'
                });

            if (error) {
                console.error('Error creating subscription in Supabase:', error);
                throw error;
            }

            console.log('Subscription created successfully for user:', userId, 'tier:', tier);

            // Send subscription confirmation email
            sendSubscriptionConfirmationEmail(userId, tier, subscriptionId).catch(err =>
                console.error('Failed to send subscription confirmation email:', err)
            );
        } else {
            console.warn('No subscription_id in transaction - this might be a one-time payment');
        }
    } catch (error) {
        console.error('Error handling transaction completed:', error);
        throw error;
    }
}

async function handleSubscriptionCreated(data: any) {
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

        // Get tier from price ID
        const priceId = data.items?.[0]?.price?.id;
        const tier = getTierByPriceId(priceId);
        const customerId = data.customer_id;
        const subscriptionId = data.id;

        console.log('Subscription created event:', {
            subscriptionId,
            customerId,
            priceId,
            tier,
            status: data.status,
            customData: data.custom_data
        });

        if (!tier) {
            console.error('Could not determine tier from price ID:', priceId, 'Available items:', data.items);
            return;
        }

        // Get userId from custom_data if available
        const userId = data.custom_data?.userId;

        if (userId) {
            // We have userId from custom_data - create or update subscription
            // Calculate period end - if Paddle's date seems wrong, calculate it ourselves
            let periodEnd = data.current_billing_period?.ends_at;
            const periodStart = data.current_billing_period?.starts_at || new Date().toISOString();

            // If no end date or it seems wrong (before start date), calculate it
            if (!periodEnd || new Date(periodEnd) <= new Date(periodStart)) {
                const startDate = new Date(periodStart);
                // Add 1 month for monthly subscriptions
                startDate.setMonth(startDate.getMonth() + 1);
                periodEnd = startDate.toISOString();
            }

            const { error } = await supabaseAdmin
                .from('subscriptions')
                .upsert({
                    user_id: userId,
                    tier: tier.toLowerCase(),
                    status: data.status === 'trialing' ? 'trialing' : 'active',
                    paddle_customer_id: customerId,
                    paddle_subscription_id: subscriptionId,
                    current_period_start: periodStart,
                    current_period_end: periodEnd,
                    cancel_at_period_end: data.scheduled_change?.action === 'cancel',
                    updated_at: new Date().toISOString(),
                }, {
                    onConflict: 'user_id'
                });

            if (error) {
                console.error('Error creating subscription with userId:', error);
                throw error;
            }

            console.log('Subscription created successfully for user:', userId, 'tier:', tier);

            // Send confirmation email
            sendSubscriptionConfirmationEmail(userId, tier, subscriptionId).catch(err =>
                console.error('Failed to send subscription confirmation email:', err)
            );
        } else {
            // Try to find user by customer ID
            const { data: existingSubscription } = await supabaseAdmin
                .from('subscriptions')
                .select('user_id')
                .eq('paddle_customer_id', customerId)
                .maybeSingle();

            if (existingSubscription) {
                // Update existing subscription
                // Calculate period end - if Paddle's date seems wrong, calculate it ourselves
                let periodEnd = data.current_billing_period?.ends_at;
                const periodStart = data.current_billing_period?.starts_at || new Date().toISOString();

                // If no end date or it seems wrong (before start date), calculate it
                if (!periodEnd || new Date(periodEnd) <= new Date(periodStart)) {
                    const startDate = new Date(periodStart);
                    // Add 1 month for monthly subscriptions
                    startDate.setMonth(startDate.getMonth() + 1);
                    periodEnd = startDate.toISOString();
                }

                const { error } = await supabaseAdmin
                    .from('subscriptions')
                    .update({
                        tier: tier.toLowerCase(),
                        status: data.status === 'trialing' ? 'trialing' : 'active',
                        paddle_subscription_id: subscriptionId,
                        current_period_start: periodStart,
                        current_period_end: periodEnd,
                        cancel_at_period_end: data.scheduled_change?.action === 'cancel',
                        updated_at: new Date().toISOString(),
                    })
                    .eq('paddle_customer_id', customerId);

                if (error) {
                    console.error('Error updating subscription:', error);
                    throw error;
                }

                console.log('Subscription updated for existing customer:', customerId);
            } else {
                console.error('Cannot create subscription - no userId in custom_data and no existing subscription found for customer:', customerId);
            }
        }
    } catch (error) {
        console.error('Error handling subscription created:', error);
        throw error;
    }
}

async function handleSubscriptionUpdated(data: any) {
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

        const customerId = data.customer_id;
        const subscriptionId = data.id;

        // Get tier from price ID
        const priceId = data.items?.[0]?.price?.id;
        const tier = getTierByPriceId(priceId);

        const { data: existingSubscription, error: fetchError } = await supabaseAdmin
            .from('subscriptions')
            .select('user_id, tier')
            .eq('paddle_customer_id', customerId)
            .maybeSingle();

        if (fetchError || !existingSubscription) {
            console.error('Subscription not found for customer:', customerId);
            return;
        }

        // Calculate period end - if Paddle's date seems wrong, calculate it ourselves
        let periodEnd = data.current_billing_period?.ends_at;
        const periodStart = data.current_billing_period?.starts_at || new Date().toISOString();

        // If no end date or it seems wrong (before start date), calculate it
        if (!periodEnd || new Date(periodEnd) <= new Date(periodStart)) {
            const startDate = new Date(periodStart);
            // Add 1 month for monthly subscriptions
            startDate.setMonth(startDate.getMonth() + 1);
            periodEnd = startDate.toISOString();
        }

        const updateData: any = {
            status: data.status === 'trialing' ? 'trialing' : data.status,
            current_period_start: periodStart,
            current_period_end: periodEnd,
            cancel_at_period_end: data.scheduled_change?.action === 'cancel',
            updated_at: new Date().toISOString(),
        };

        // Update tier if it changed
        if (tier && tier !== existingSubscription.tier) {
            updateData.tier = tier;
        }

        // Handle canceled/paused subscriptions
        if (data.status === 'canceled' || data.status === 'paused') {
            updateData.tier = 'free';
            updateData.status = 'cancelled';
        }

        const { error } = await supabaseAdmin
            .from('subscriptions')
            .update(updateData)
            .eq('paddle_customer_id', customerId);

        if (error) {
            console.error('Error updating subscription in Supabase:', error);
            throw error;
        }

        console.log('Subscription updated successfully for customer:', customerId);
    } catch (error) {
        console.error('Error handling subscription updated:', error);
        throw error;
    }
}

async function handleSubscriptionCanceled(data: any) {
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

        const customerId = data.customer_id;

        const { error } = await supabaseAdmin
            .from('subscriptions')
            .update({
                tier: 'free',
                status: 'cancelled',
                paddle_subscription_id: null,
                cancel_at_period_end: false,
                updated_at: new Date().toISOString(),
            })
            .eq('paddle_customer_id', customerId);

        if (error) {
            console.error('Error downgrading subscription in Supabase:', error);
            throw error;
        }

        console.log('Subscription canceled, user downgraded to FREE:', customerId);

        // Send cancellation email
        sendSubscriptionCanceledEmail(customerId, data).catch(err =>
            console.error('Failed to send subscription canceled email:', err)
        );
    } catch (error) {
        console.error('Error handling subscription canceled:', error);
        throw error;
    }
}

async function sendSubscriptionConfirmationEmail(userId: string, tier: string, subscriptionId: string) {
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

        const { data: user } = await supabaseAdmin.auth.admin.getUserById(userId);
        const { data: subscription } = await supabaseAdmin
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (user?.user?.email && subscription) {
            const userName = user.user.user_metadata?.name || user.user.email.split('@')[0];
            const priceDetails = getPriceDetails(tier.toUpperCase());

            // Determine billing cycle from subscription
            const billingCycle = subscription.current_period_end
                ? (new Date(subscription.current_period_end).getTime() - new Date(subscription.current_period_start).getTime()) > (32 * 24 * 60 * 60 * 1000)
                    ? 'annual' as const
                    : 'monthly' as const
                : 'monthly' as const;

            const amount = billingCycle === 'annual' ? priceDetails.annual : priceDetails.monthly;
            const nextBillingDate = subscription.current_period_end
                ? new Date(subscription.current_period_end).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
                : undefined;

            await EmailService.sendSubscriptionConfirmedEmail({
                to: user.user.email,
                userName,
                tier: tier.toUpperCase(),
                billingCycle,
                amount,
                nextBillingDate,
            });
        }
    } catch (error) {
        console.error('Error sending subscription confirmation email:', error);
    }
}

async function sendSubscriptionCanceledEmail(customerId: string, data: any) {
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

        const { data: subscription } = await supabaseAdmin
            .from('subscriptions')
            .select('user_id, tier')
            .eq('paddle_customer_id', customerId)
            .single();

        if (subscription) {
            const { data: user } = await supabaseAdmin.auth.admin.getUserById(subscription.user_id);

            if (user?.user?.email) {
                const userName = user.user.user_metadata?.name || user.user.email.split('@')[0];
                const endDate = data.current_billing_period?.ends_at
                    ? new Date(data.current_billing_period.ends_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })
                    : undefined;

                await EmailService.sendSubscriptionCanceledEmail({
                    to: user.user.email,
                    userName,
                    tier: subscription.tier.toUpperCase(),
                    endDate,
                });
            }
        }
    } catch (error) {
        console.error('Error sending subscription canceled email:', error);
    }
}
