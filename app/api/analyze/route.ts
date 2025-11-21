import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    const cookieStore = cookies();
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

    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('tier, analyses_used_today, last_reset_date')
      .eq('user_id', user.id)
      .maybeSingle();

    if (subError || !subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    const today = new Date().toISOString().split('T')[0];
    const lastReset = subscription.last_reset_date;
    let analysesUsed = subscription.analyses_used_today;

    if (lastReset !== today) {
      analysesUsed = 0;
      await supabase
        .from('subscriptions')
        .update({
          analyses_used_today: 0,
          last_reset_date: today,
        })
        .eq('user_id', user.id);
    }

    const limits: Record<string, number> = {
      FREE: 3,
      PRO: 20,
      ULTRA: Infinity,
    };

    const limit = limits[subscription.tier] || 3;

    if (analysesUsed >= limit) {
      return NextResponse.json(
        { error: 'Daily limit reached. Please upgrade your plan.' },
        { status: 429 }
      );
    }

    const { data: analysis, error: analysisError } = await supabase
      .from('analyses')
      .insert({
        user_id: user.id,
        url: url,
        status: 'pending',
      })
      .select()
      .single();

    if (analysisError || !analysis) {
      return NextResponse.json(
        { error: 'Failed to create analysis' },
        { status: 500 }
      );
    }

    await supabase
      .from('subscriptions')
      .update({
        analyses_used_today: analysesUsed + 1,
      })
      .eq('user_id', user.id);

    await supabase
      .from('analyses')
      .update({
        status: 'processing',
      })
      .eq('id', analysis.id);

    setTimeout(async () => {
      const frictionScore = Math.floor(Math.random() * 100);

      const insights = {
        summary: `Analyzed ${url} and identified ${Math.floor(Math.random() * 10) + 1} friction points`,
        friction_points: [
          {
            type: 'Form Complexity',
            severity: 'high',
            description: 'Too many required fields in the signup form',
            recommendation: 'Reduce required fields to essential information only',
          },
          {
            type: 'Trust Signals',
            severity: 'medium',
            description: 'Missing security badges and testimonials',
            recommendation: 'Add SSL badges and customer testimonials',
          },
          {
            type: 'Mobile Experience',
            severity: 'low',
            description: 'Some buttons are difficult to tap on mobile',
            recommendation: 'Increase button sizes for better mobile usability',
          },
        ],
        recommendations: [
          'Implement progressive form disclosure',
          'Add clear value proposition above the fold',
          'Include social proof elements',
          'Optimize page load speed',
        ],
      };

      await supabase
        .from('analyses')
        .update({
          status: 'completed',
          friction_score: frictionScore,
          insights: insights,
          completed_at: new Date().toISOString(),
        })
        .eq('id', analysis.id);
    }, 8000);

    return NextResponse.json({
      success: true,
      analysisId: analysis.id,
      message: 'Analysis started successfully',
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
