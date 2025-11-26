import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import axios from 'axios';
import { analyzeWebsiteFriction } from '@/lib/openrouter';
import { trackEventServer } from '@/lib/track-event-server';
import { checkMonthlyUsageLimit, canExportPDF } from '@/lib/subscription-check-paddle';

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
  // Extract traditional HTML forms
  const formRegex = /<form[\s\S]*?<\/form>/gi;
  const forms = html.match(formRegex) || [];

  // Also detect common patterns for JavaScript-rendered forms
  const jsFormIndicators = [
    // React Hook Form, Formik, etc.
    /data-form[^>]*>/gi,
    /role=["']form["'][^>]*>/gi,
    // Common form libraries
    /class=["'][^"']*form[^"']*["'][^>]*>/gi,
    // Input groups that might be forms
    /<div[^>]*>\s*<input[^>]*type=["'](email|password|text)["'][^>]*>/gi,
  ];

  const jsFormMatches: string[] = [];
  jsFormIndicators.forEach(pattern => {
    const matches = html.match(pattern);
    if (matches) {
      jsFormMatches.push(...matches);
    }
  });

  // Look for input fields outside traditional forms
  const inputRegex = /<input[^>]*type=["'](email|password|text|tel|number)["'][^>]*>/gi;
  const inputs = html.match(inputRegex) || [];

  // Look for submit buttons
  const buttonRegex = /<button[^>]*type=["']submit["'][^>]*>[\s\S]*?<\/button>/gi;
  const submitButtons = html.match(buttonRegex) || [];

  const hasInputs = inputs.length > 0;
  const hasSubmitButtons = submitButtons.length > 0;
  const hasJsFormIndicators = jsFormMatches.length > 0;

  if (forms.length === 0 && !hasInputs && !hasJsFormIndicators) {
    return 'No forms found on the page.';
  }

  // Build a comprehensive form context
  const formContext: string[] = [];

  if (forms.length > 0) {
    formContext.push(`=== Traditional HTML Forms (${forms.length}) ===`);
    formContext.push(forms.join('\n\n'));
  }

  if (hasInputs || hasSubmitButtons || hasJsFormIndicators) {
    formContext.push(`\n=== Form Elements Detected ===`);
    formContext.push(`Input fields: ${inputs.length}`);
    formContext.push(`Submit buttons: ${submitButtons.length}`);
    formContext.push(`JS form indicators: ${jsFormMatches.length}`);

    // Include sample inputs for context
    if (inputs.length > 0) {
      formContext.push(`\nSample inputs:\n${inputs.slice(0, 10).join('\n')}`);
    }

    if (submitButtons.length > 0) {
      formContext.push(`\nSubmit buttons:\n${submitButtons.slice(0, 5).join('\n')}`);
    }
  }

  return formContext.join('\n');
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
      const status = error.response?.status;
      console.error('Fetch error:', { url, status, message: error.message });

      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout: Website took too long to respond');
      }
      if (status === 403) {
        throw new Error('Access denied: Website has anti-bot protection. Try a different URL or contact support for help analyzing protected sites.');
      }
      if (status === 404) {
        throw new Error('Page not found: The URL does not exist');
      }
      if (status && status >= 500) {
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

    const cookieStore = await cookies();
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

    // Check monthly usage limit with new Paddle system
    const usageCheck = await checkMonthlyUsageLimit(user.id);

    if (!usageCheck.allowed) {
      return NextResponse.json(
        {
          error: 'Monthly limit reached. Please upgrade your plan to continue.',
          limit: usageCheck.limit,
          remaining: usageCheck.remaining,
          tier: usageCheck.tier,
        },
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
      processAnalysis(analysisId, url, supabase, user.id).catch((error) => {
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

async function processAnalysis(analysisId: string, url: string, supabase: any, userId: string) {
  const startTime = Date.now();
  try {
    const html = await fetchWebsiteHtml(url);

    const forms = extractForms(html);

    // Increased from 50KB to 100KB to capture more content
    const relevantHtml = html.slice(0, 100000);

    const aiAnalysis = await analyzeWebsiteFriction(url, relevantHtml);

    const formsDetected = forms !== 'No forms found on the page.';
    const formCount = formsDetected ? (forms.match(/<form/gi) || []).length : 0;

    const insights = {
      summary: aiAnalysis.summary,
      friction_points: aiAnalysis.issues.map((issue) => ({
        type: issue.type,
        severity: issue.severity,
        description: issue.description,
        recommendation: issue.fix,
      })),
      forms_detected: formsDetected,
      forms_count: formCount,
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

    // Usage is tracked automatically by the analyses table
    // No need to manually increment counters with monthly limits

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
