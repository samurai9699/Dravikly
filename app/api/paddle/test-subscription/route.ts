import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
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

        // Get userId from query params
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'userId query parameter required' },
                { status: 400 }
            );
        }

        // Check subscription
        const { data: subscription, error } = await supabaseAdmin
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

        if (error) {
            return NextResponse.json(
                { error: 'Database error', details: error },
                { status: 500 }
            );
        }

        return NextResponse.json({
            userId,
            subscription: subscription || 'No subscription found',
            hasSubscription: !!subscription,
        });
    } catch (error: any) {
        console.error('Test subscription error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
