import axios from 'axios';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1';
const MODEL = 'nvidia/nemotron-3-nano-30b-a3b:free';

export interface FrictionIssue {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  fix: string;
}

export interface FrictionAnalysis {
  score: number;
  issues: FrictionIssue[];
  summary: string;
}

const ANALYSIS_PROMPT = `You are a conversion rate optimization expert. Analyze the webpage HTML for friction points that hurt conversions.

## ANALYZE THESE CATEGORIES:

### 1. FORM COMPLEXITY
- Too many fields (optimal: 3-5 fields)
- Unclear or missing labels
- No input type optimization (email, tel, etc.)
- Missing placeholder text
- No autofill/autocomplete attributes

### 2. TRUST SIGNALS
- Missing security badges (SSL, payment icons)
- No testimonials or social proof
- No privacy policy links near forms
- Missing company info or contact details
- No money-back guarantees

### 3. CTA (CALL-TO-ACTION) QUALITY
- Generic button text ("Submit", "Click Here")
- Low contrast or hard to find buttons
- Multiple competing CTAs causing confusion
- No sense of urgency or value proposition
- CTA too small or not prominent

### 4. MOBILE UX (infer from HTML)
- No viewport meta tag
- Fixed widths that won't adapt
- Tiny font sizes (< 14px)
- No touch-friendly input sizing
- Tables used for layout

### 5. USER EXPERIENCE
- No progress indicators on multi-step forms
- Missing error validation patterns
- Asking sensitive info too early (payment before value)
- Intrusive elements (popups, overlays blocking content)
- Confusing navigation or too many choices

### 6. PAGE STRUCTURE
- No clear headline or value proposition
- Important content below the fold
- Cluttered layout with distractions
- Missing or weak subheadings
- No visual hierarchy

For each issue found, provide:
- type: Category name (e.g., "form_complexity", "missing_trust_signals", "weak_cta", "mobile_ux", "user_experience", "page_structure")
- severity: "low", "medium", or "high"
- description: Specific problem found
- fix: Actionable recommendation with specific suggestion

Calculate friction score 0-100 (lower = better):
- 0-20: Excellent (minimal friction)
- 21-40: Good (minor issues)
- 41-60: Needs Work (moderate friction)
- 61-80: Poor (significant friction)
- 81-100: Critical (severe problems)

Return ONLY valid JSON:
{
  "score": <number 0-100>,
  "issues": [
    {
      "type": "category_name",
      "severity": "low|medium|high",
      "description": "specific issue found",
      "fix": "actionable fix"
    }
  ],
  "summary": "2-3 sentence overview"
}`;

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function analyzeWebsiteFriction(
  url: string,
  html: string
): Promise<FrictionAnalysis> {
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const apiKey = process.env.OPENROUTER_API_KEY;

      if (!apiKey) {
        throw new Error('OpenRouter API key not configured');
      }

      const response = await axios.post(
        `${OPENROUTER_API_URL}/chat/completions`,
        {
          model: MODEL,
          messages: [
            {
              role: 'system',
              content: ANALYSIS_PROMPT,
            },
            {
              role: 'user',
              content: `URL: ${url}\n\nHTML Content:\n${html.slice(0, 25000)}`,
            },
          ],
          response_format: { type: 'json_object' },
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            'X-Title': 'Website Friction Analyzer',
          },
          timeout: 45000, // 45 second timeout
        }
      );

      const content = response.data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No response from OpenRouter API');
      }

      const analysis: FrictionAnalysis = JSON.parse(content);

      if (
        typeof analysis.score !== 'number' ||
        !Array.isArray(analysis.issues) ||
        typeof analysis.summary !== 'string'
      ) {
        throw new Error('Invalid response format from AI');
      }

      return analysis;
    } catch (error) {
      lastError = error as Error;

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.error?.message || error.message;

        // Don't retry on client errors (4xx) except rate limits
        if (status && status >= 400 && status < 500 && status !== 429) {
          throw new Error(
            `OpenRouter API error (${status}): ${message}`
          );
        }

        // Retry on server errors (5xx), timeouts, or rate limits
        if (attempt < maxRetries) {
          const backoffMs = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Exponential backoff: 1s, 2s, 4s (max 5s)
          console.log(`AI request failed (attempt ${attempt}/${maxRetries}), retrying in ${backoffMs}ms...`);
          await sleep(backoffMs);
          continue;
        }

        throw new Error(
          `OpenRouter API error after ${maxRetries} attempts (${status || 'unknown'}): ${message}`
        );
      }

      // Retry on other errors
      if (attempt < maxRetries) {
        const backoffMs = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        console.log(`AI request failed (attempt ${attempt}/${maxRetries}), retrying in ${backoffMs}ms...`);
        await sleep(backoffMs);
        continue;
      }

      throw error;
    }
  }

  throw lastError || new Error('AI analysis failed after all retries');
}

export async function testOpenRouterConnection(): Promise<boolean> {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return false;
    }

    await axios.get(`${OPENROUTER_API_URL}/models`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    return true;
  } catch (error) {
    return false;
  }
}
