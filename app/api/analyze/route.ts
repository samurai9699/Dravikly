import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import axios from 'axios';
import { analyzeWebsiteFriction } from '@/lib/openrouter';
import { trackEventServer } from '@/lib/track-event-server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function extractForms(html: string): string {
  const formRegex = /<form[\s\S]*?<\/form>/gi;
  const forms = html.match(formRegex);

  if (!forms || forms.length === 0) {
    return 'No forms found on the page.';
  }

  return forms.join('\n\n');
}

async function fetchWebsiteHtml(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      timeout: 15000,
      maxRedirects: 5,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"macOS"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
      },
    });

    if (typeof response.data !== 'string') {
      throw new Error('Invalid response: Expected HTML content');
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout: Website took too long to respond');
      }
      if (error.response?.status === 403) {
        throw new Error('Access denied: Website has anti-bot protection. Try a different URL or contact support for help analyzing protected sites.');
      }
      if (error.response?.status === 404) {
        throw new Error('Page not found: The URL does not exist');
      }
      if (error.response?.status && error.response.status >= 500) {
        throw new Error('Website error: The server returned an error');
      }
      throw new Error(`Failed to fetch website: ${error.message}`);
    }
    throw error;
  }
}

export async function POST(request: Request) {
  let analysisId: string | null = null;
  let supabase: any = null;

  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    if (!isValidUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid URL format. Please provide a valid HTTP or HTTPS URL.' },
        { status: 400 }
      );
    }

    const cookieStore = cookies();
    supabase = createServerClient(
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

    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('tier, analyses_used_today, last_reset_date')
      .eq('user_id', user.id)
      .maybeSingle();

    if (subError || !subscription) {
      return NextResponse.json(
        { error: 'Subscription not found. Please contact support.' },
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
        { error: 'Daily limit reached. Please upgrade your plan to continue.' },
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
        { error: 'Failed to create analysis record. Please try again.' },
        { status: 500 }
      );
    }

    analysisId = analysis.id;

    await trackEventServer('analysis_started', { url }, user.id);

    await supabase
      .from('analyses')
      .update({
        status: 'processing',
      })
      .eq('id', analysisId);

    if (analysisId) {
      processAnalysis(analysisId, url, supabase, user.id, analysesUsed).catch((error) => {
        console.error('Background analysis error:', error);
      });
    }

    return NextResponse.json({
      success: true,
      analysisId: analysisId,
      message: 'Analysis started successfully',
    });
  } catch (error) {
    console.error('Analysis error:', error);

    if (analysisId && supabase) {
      try {
        await supabase
          .from('analyses')
          .update({
            status: 'failed',
            completed_at: new Date().toISOString(),
          })
          .eq('id', analysisId);
      } catch (updateError) {
        console.error('Failed to update analysis status:', updateError);
      }
    }

    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

async function processAnalysis(analysisId: string, url: string, supabase: any, userId: string, analysesUsed: number) {
  const startTime = Date.now();
  try {
    const html = await fetchWebsiteHtml(url);

    const forms = extractForms(html);

    const relevantHtml = html.slice(0, 50000);

    const aiAnalysis = await analyzeWebsiteFriction(url, relevantHtml);

    const insights = {
      summary: aiAnalysis.summary,
      friction_points: aiAnalysis.issues.map((issue) => ({
        type: issue.type,
        severity: issue.severity,
        description: issue.description,
        recommendation: issue.fix,
      })),
      forms_detected: forms !== 'No forms found on the page.',
      forms_count: forms === 'No forms found on the page.' ? 0 : (forms.match(/<form/gi) || []).length,
    };

    const duration = Math.round((Date.now() - startTime) / 1000);

    await supabase
      .from('analyses')
      .update({
        status: 'completed',
        friction_score: Math.min(100, Math.max(0, aiAnalysis.score)),
        insights: insights,
        completed_at: new Date().toISOString(),
      })
      .eq('id', analysisId);

    // Only increment counter on successful completion
    await supabase
      .from('subscriptions')
      .update({
        analyses_used_today: analysesUsed + 1,
      })
      .eq('user_id', userId);

    await trackEventServer('analysis_completed', { url, duration }, userId);
  } catch (error) {
    console.error('Processing error:', error);

    let errorMessage = 'Unknown error occurred';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    await supabase
      .from('analyses')
      .update({
        status: 'failed',
        insights: {
          error: errorMessage,
          summary: 'Analysis failed',
        },
        completed_at: new Date().toISOString(),
      })
      .eq('id', analysisId);
  }
}
