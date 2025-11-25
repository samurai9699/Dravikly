import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: 'Stripe configuration missing' },
        { status: 503 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-11-17.clover',
    });

    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('No Stripe signature found');
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    console.log('Webhook event received:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
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

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-11-17.clover',
    });

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

    const userId = session.metadata?.user_id;
    const tier = session.metadata?.tier;

    if (!userId || !tier) {
      console.error('Missing metadata in checkout session:', session.id);
      return;
    }

    const subscriptionId = session.subscription as string;
    const customerId = session.customer as string;

    if (!subscriptionId || !customerId) {
      console.error('Missing subscription or customer ID:', session.id);
      return;
    }

    const stripeSubscription: any = await stripe.subscriptions.retrieve(subscriptionId);

    const { error } = await supabaseAdmin
      .from('subscriptions')
      .upsert({
        user_id: userId,
        tier: tier.toUpperCase(),
        status: stripeSubscription.status === 'trialing' ? 'trialing' : 'active',
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        current_period_start: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: stripeSubscription.cancel_at_period_end,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      console.error('Error creating subscription in Supabase:', error);
      throw error;
    }

    console.log('Subscription created successfully for user:', userId);
  } catch (error) {
    console.error('Error handling checkout completed:', error);
    throw error;
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
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

    const stripeSubscription: any = subscription;
    const customerId = stripeSubscription.customer as string;

    const { data: existingSubscription, error: fetchError } = await supabaseAdmin
      .from('subscriptions')
      .select('user_id, tier')
      .eq('stripe_customer_id', customerId)
      .maybeSingle();

    if (fetchError || !existingSubscription) {
      console.error('Subscription not found for customer:', customerId);
      return;
    }

    const updateData: any = {
      status: stripeSubscription.status === 'trialing' ? 'trialing' : stripeSubscription.status,
      current_period_start: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: stripeSubscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    };

    if (stripeSubscription.status === 'canceled' || stripeSubscription.status === 'unpaid') {
      updateData.tier = 'FREE';
      updateData.status = 'cancelled';
    }

    const { error } = await supabaseAdmin
      .from('subscriptions')
      .update(updateData)
      .eq('stripe_customer_id', customerId);

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

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
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

    const customerId = subscription.customer as string;

    const { error } = await supabaseAdmin
      .from('subscriptions')
      .update({
        tier: 'FREE',
        status: 'cancelled',
        stripe_subscription_id: null,
        cancel_at_period_end: false,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_customer_id', customerId);

    if (error) {
      console.error('Error downgrading subscription in Supabase:', error);
      throw error;
    }

    console.log('Subscription deleted, user downgraded to FREE:', customerId);
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
    throw error;
  }
}
