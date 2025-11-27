import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
    try {
        const { subscriptionId } = await request.json();

        if (!subscriptionId) {
            return NextResponse.json(
                { error: 'Subscription ID is required' },
                { status: 400 }
            );
        }

        const supabase = await createServerClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Update subscription to cancel at period end
        const { error: updateError } = await (supabase
            .from('subscriptions') as any)
            .update({ cancel_at_period_end: true })
            .eq('user_id', user.id)
            .eq('paddle_subscription_id', subscriptionId);

        if (updateError) {
            console.error('Error updating subscription:', updateError);
            return NextResponse.json(
                { error: 'Failed to cancel subscription' },
                { status: 500 }
            );
        }

        // Note: In production, you would also call Paddle API to cancel the subscription
        // const paddleResponse = await fetch(`https://api.paddle.com/subscriptions/${subscriptionId}/cancel`, {
        //   method: 'POST',
        //   headers: {
        //     'Authorization': `Bearer ${process.env.PADDLE_API_KEY}`,
        //     'Content-Type': 'application/json'
        //   }
        // });

        return NextResponse.json({
            success: true,
            message: 'Subscription will be cancelled at the end of the billing period'
        });
    } catch (error) {
        console.error('Cancel subscription error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
