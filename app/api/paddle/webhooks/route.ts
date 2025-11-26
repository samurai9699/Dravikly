import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { paddle } from '@/lib/paddle/server';
import { getTierByPriceId } from '@/lib/paddle-config';

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
        // Note: Paddle's signature verification is done differently than Stripe
        // The signature header contains: ts=timestamp;h1=signature
        const isValid = verifyPaddleSignature(body, signature, webhookSecret);

        if (!isValid) {
            console.error('Invalid Paddle signature');
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 400 }
            );
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

        // Parse signature header: ts=timestamp;h1=signature
        const parts = signature.split(';');
        const timestamp = parts.find(p => p.startsWith('ts='))?.split('=')[1];
        const signatureHash = parts.find(p => p.startsWith('h1='))?.split('=')[1];

        if (!timestamp || !signatureHash) {
            return false;
        }

        // Create the signed payload
        const signedPayload = `${timestamp}:${body}`;

        // Calculate expected signature
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(signedPayload)
            .digest('hex');

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

        if (!userId || !tier) {
            console.error('Missing custom data in transaction:', data.id);
            return;
        }

        const customerId = data.customer_id;
        const subscriptionId = data.subscription_id;

        // For one-time payments, subscription_id might be null
        if (subscriptionId) {
            // This is a subscription payment
            const subscription = await paddle.subscriptions.get(subscriptionId);

            const { error } = await supabaseAdmin
                .from('subscriptions')
                .upsert({
                    user_id: userId,
                    tier: tier.toLowerCase(),
                    status: subscription.status === 'trialing' ? 'trialing' : 'active',
                    paddle_customer_id: customerId,
                    paddle_subscription_id: subscriptionId,
                    current_period_start: subscription.currentBillingPeriod?.startsAt || new Date().toISOString(),
                    current_period_end: subscription.currentBillingPeriod?.endsAt || null,
                    cancel_at_period_end: subscription.scheduledChange?.action === 'cancel',
                    updated_at: new Date().toISOString(),
                }, {
                    onConflict: 'user_id'
                });

            if (error) {
                console.error('Error creating subscription in Supabase:', error);
                throw error;
            }

            console.log('Subscription created successfully for user:', userId);
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

        if (!tier) {
            console.error('Could not determine tier from price ID:', priceId);
            return;
        }

        const customerId = data.customer_id;
        const subscriptionId = data.id;

        // Try to find user by customer ID first
        const { data: existingSubscription } = await supabaseAdmin
            .from('subscriptions')
            .select('user_id')
            .eq('paddle_customer_id', customerId)
            .maybeSingle();

        if (existingSubscription) {
            // Update existing subscription
            const { error } = await supabaseAdmin
                .from('subscriptions')
                .update({
                    tier: tier,
                    status: data.status === 'trialing' ? 'trialing' : 'active',
                    paddle_subscription_id: subscriptionId,
                    current_period_start: data.current_billing_period?.starts_at || new Date().toISOString(),
                    current_period_end: data.current_billing_period?.ends_at || null,
                    cancel_at_period_end: data.scheduled_change?.action === 'cancel',
                    updated_at: new Date().toISOString(),
                })
                .eq('paddle_customer_id', customerId);

            if (error) {
                console.error('Error updating subscription:', error);
                throw error;
            }
        }

        console.log('Subscription created for customer:', customerId);
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

        const updateData: any = {
            status: data.status === 'trialing' ? 'trialing' : data.status,
            current_period_start: data.current_billing_period?.starts_at || new Date().toISOString(),
            current_period_end: data.current_billing_period?.ends_at || null,
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
    } catch (error) {
        console.error('Error handling subscription canceled:', error);
        throw error;
    }
}
