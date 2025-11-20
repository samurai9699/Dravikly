import axios from 'axios';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1';
const MODEL = 'x-ai/grok-beta';

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

const ANALYSIS_PROMPT = `You are a conversion rate optimization expert analyzing website forms for friction points.

Analyze the following webpage HTML and identify form friction issues based on these criteria:

1. **Too many fields**: Forms with excessive fields reduce completion rates
2. **Missing trust signals**: Lack of security badges, testimonials, or guarantees near submit buttons
3. **Weak CTA copy**: Submit buttons with generic or unclear text
4. **Mobile optimization issues**: Forms that aren't responsive or mobile-friendly
5. **Missing error validation UX**: No clear validation feedback or error messages
6. **No progress indicators**: Multi-step forms without showing user progress
7. **Asking for sensitive info too early**: Requesting payment/SSN before building trust

For each issue found, provide:
- type: The friction category (e.g., "too_many_fields", "missing_trust_signals")
- severity: "low", "medium", or "high"
- description: Clear explanation of the problem
- fix: Actionable recommendation to resolve the issue

Calculate an overall friction score from 0-100:
- 0-30: Excellent (minimal friction)
- 31-60: Good (some optimization needed)
- 61-80: Fair (significant friction)
- 81-100: Poor (major friction issues)

Return ONLY valid JSON in this exact format:
{
  "score": <number 0-100>,
  "issues": [
    {
      "type": "issue_type",
      "severity": "low|medium|high",
      "description": "description of issue",
      "fix": "recommended fix"
    }
  ],
  "summary": "brief overview of findings"
}`;

export async function analyzeWebsiteFriction(
  url: string,
  html: string
): Promise<FrictionAnalysis> {
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
            content: `URL: ${url}\n\nHTML Content:\n${html.slice(0, 50000)}`,
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
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.error?.message || error.message;

      throw new Error(
        `OpenRouter API error (${status || 'unknown'}): ${message}`
      );
    }

    throw error;
  }
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
