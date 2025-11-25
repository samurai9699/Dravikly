import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please contact support.' },
        { status: 503 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-11-17.clover',
    });

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
        { error: 'Unauthorized. Please log in to continue.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { tier, billingCadence } = body as {
      tier?: string;
      billingCadence?: string;
    };

    const normalizedTier = tier?.toLowerCase();
    const normalizedCadence = billingCadence === 'annual' ? 'annual' : 'monthly';

    if (!normalizedTier || !['pro', 'ultra'].includes(normalizedTier)) {
      return NextResponse.json(
        { error: 'Invalid tier. Must be "pro" or "ultra".' },
        { status: 400 }
      );
    }

    const priceMap = {
      pro: {
        monthly: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
        annual: process.env.NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID,
      },
      ultra: {
        monthly: process.env.NEXT_PUBLIC_STRIPE_ULTRA_PRICE_ID,
        annual: process.env.NEXT_PUBLIC_STRIPE_ULTRA_ANNUAL_PRICE_ID,
      },
    } as const;

    const priceId = priceMap[normalizedTier as 'pro' | 'ultra'][normalizedCadence];

    if (!priceId) {
      return NextResponse.json(
        {
          error: `Stripe price ID not configured for the ${normalizedCadence} ${normalizedTier} plan.`,
        },
        { status: 503 }
      );
    }

    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: user.email,
      success_url: `${origin}/dashboard?upgraded=true`,
      cancel_url: `${origin}/pricing`,
      metadata: {
        user_id: user.id,
        tier: normalizedTier.toUpperCase(),
        billing_cadence: normalizedCadence,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: `Payment service error: ${error.message}` },
        { status: 502 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create checkout session. Please try again later.' },
      { status: 500 }
    );
  }
}
