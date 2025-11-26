import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { paddle } from '@/lib/paddle/server';
import { getPriceIdForTier, TierName } from '@/lib/paddle-config';

export const dynamic = 'force-dynamic';

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
                { error: 'Unauthorized. Please log in to continue.' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { tier, billingCycle } = body as {
            tier?: string;
            billingCycle?: 'monthly' | 'annual';
        };

        const normalizedTier = tier?.toLowerCase() as TierName;
        const normalizedCycle = billingCycle === 'annual' ? 'annual' : 'monthly';

        if (!normalizedTier || !['starter', 'pro', 'enterprise'].includes(normalizedTier)) {
            return NextResponse.json(
                { error: 'Invalid tier. Must be "starter", "pro", or "enterprise".' },
                { status: 400 }
            );
        }

        const priceId = getPriceIdForTier(normalizedTier, normalizedCycle);

        if (!priceId) {
            return NextResponse.json(
                {
                    error: `Price ID not configured for the ${normalizedCycle} ${normalizedTier} plan.`,
                },
                { status: 503 }
            );
        }

        const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        // Create Paddle checkout transaction
        const transaction = await paddle.transactions.create({
            items: [
                {
                    priceId: priceId,
                    quantity: 1,
                },
            ],
            customData: {
                userId: user.id,
                tier: normalizedTier.toUpperCase(),
                billingCycle: normalizedCycle,
                email: user.email || '',
            },
        });

        // Get checkout URL from transaction
        const checkoutUrl = transaction.checkout?.url || null;

        if (!checkoutUrl) {
            throw new Error('Failed to get checkout URL from Paddle');
        }

        // Return the checkout URL
        return NextResponse.json({
            url: checkoutUrl,
            transactionId: transaction.id,
        });
    } catch (error: any) {
        console.error('Paddle checkout error:', error);

        return NextResponse.json(
            {
                error: error.message || 'Failed to create checkout session. Please try again later.',
                details: error.response?.data || null,
            },
            { status: 500 }
        );
    }
}
