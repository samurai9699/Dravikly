'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Globe, Sparkles, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createClient } from '@/lib/supabase/client';
import { UpgradeModal } from '@/components/upgrade-modal';
import Link from 'next/link';

const PROGRESS_MESSAGES = [
  'Fetching website...',
  'Analyzing forms...',
  'Detecting friction points...',
  'Generating insights...',
];

const EXAMPLE_URLS = [
  'shopify.com/signup',
  'stripe.com/register',
  'github.com/signup',
];

export default function AnalyzePage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progressIndex, setProgressIndex] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [tier, setTier] = useState('FREE');
  const [analysesUsed, setAnalysesUsed] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('tier, analyses_used_today')
        .eq('user_id', user.id)
        .maybeSingle();

      if (subscription) {
        setTier(subscription.tier);
        setAnalysesUsed(subscription.analyses_used_today);
      }
    };

    loadUserData();
  }, [router, supabase]);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgressIndex((prev) => {
          if (prev < PROGRESS_MESSAGES.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 2000);

      return () => clearInterval(interval);
    } else {
      setProgressIndex(0);
    }
  }, [loading]);

  const isValidUrl = (urlString: string) => {
    try {
      let urlToValidate = urlString.trim();

      if (!/^https?:\/\//i.test(urlToValidate)) {
        urlToValidate = 'https://' + urlToValidate;
      }

      const url = new URL(urlToValidate);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const normalizeUrl = (urlString: string) => {
    let normalized = urlString.trim();
    if (!/^https?:\/\//i.test(normalized)) {
      normalized = 'https://' + normalized;
    }
    return normalized;
  };

  const checkLimit = () => {
    const limits = {
      FREE: 3,
      PRO: 20,
      ULTRA: Infinity,
    };

    const limit = limits[tier as keyof typeof limits] || 3;
    return analysesUsed >= limit;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a URL to analyze');
      return;
    }

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL (e.g., example.com or https://example.com)');
      return;
    }

    if (checkLimit()) {
      setShowUpgradeModal(true);
      return;
    }

    setLoading(true);
    setProgressIndex(0);

    try {
      const normalizedUrl = normalizeUrl(url);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: normalizedUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze URL');
      }

      router.push(`/dashboard/results/${data.analysisId}`);
    } catch (err) {
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      }
      setLoading(false);
    }
  };

  const handleExampleClick = (exampleUrl: string) => {
    setUrl(exampleUrl);
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl mb-4">
          <Sparkles className="w-8 h-8 text-cyan-400" />
        </div>
        <h1 className="text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Analyze Your Funnel
          </span>
        </h1>
        <p className="text-slate-400 text-lg">
          Discover friction points and get AI-powered recommendations to optimize conversions
        </p>
      </div>

      <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20">
        <CardContent className="p-8">
          {error && (
            <Alert className="mb-6 bg-red-500/10 border-red-500/50 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="url" className="text-slate-200 text-base">
                Website URL
              </Label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="url"
                  type="text"
                  placeholder="example.com/signup"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={loading}
                  className="pl-12 h-14 text-lg bg-slate-900/50 border-slate-700 focus:border-cyan-400 text-white"
                />
              </div>
              <p className="text-sm text-slate-400">
                Enter any URL you want to analyze for friction points
              </p>
            </div>

            {loading ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 rounded-lg p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                    <div className="flex-1">
                      <p className="text-white font-semibold mb-1">
                        {PROGRESS_MESSAGES[progressIndex]}
                      </p>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${((progressIndex + 1) / PROGRESS_MESSAGES.length) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400">
                    This may take a few moments. Please don't close this page.
                  </p>
                </div>
              </div>
            ) : (
              <Button
                type="submit"
                size="lg"
                className="w-full h-14 text-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white group"
                disabled={loading}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Analyze Now
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {EXAMPLE_URLS.map((exampleUrl) => (
          <button
            key={exampleUrl}
            onClick={() => handleExampleClick(exampleUrl)}
            disabled={loading}
            className="p-4 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700 hover:border-cyan-400/50 rounded-lg transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <p className="text-sm text-slate-400 mb-1">Try with:</p>
            <p className="text-white font-medium group-hover:text-cyan-400 transition-colors">
              {exampleUrl}
            </p>
          </button>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 border border-cyan-400/20">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">What we analyze:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-white font-medium">Form Complexity</p>
                <p className="text-sm text-slate-400">
                  Number of fields, validation requirements
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-white font-medium">User Experience</p>
                <p className="text-sm text-slate-400">
                  Page load time, mobile responsiveness
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-white font-medium">Trust Signals</p>
                <p className="text-sm text-slate-400">
                  Security badges, social proof
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-white font-medium">Friction Points</p>
                <p className="text-sm text-slate-400">
                  Obstacles that prevent conversions
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        feature="Daily Analysis Limit"
        requiredTier={tier === 'FREE' ? 'PRO' : 'ULTRA'}
        description={
          tier === 'FREE'
            ? "You've used all 3 analyses for today. Upgrade to PRO for 20 analyses per day, or ULTRA for unlimited analyses."
            : "You've used all 20 analyses for today. Upgrade to ULTRA for unlimited analyses and priority processing."
        }
      />
    </div>
  );
}
