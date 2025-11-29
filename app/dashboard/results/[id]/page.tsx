'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Download,
  Share2,
  ExternalLink,
  Sparkles,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { UpgradeModal } from '@/components/upgrade-modal';

interface FrictionPoint {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  recommendation: string;
}

interface Analysis {
  id: string;
  url: string;
  status: string;
  friction_score: number | null;
  insights: {
    summary: string;
    friction_points: FrictionPoint[];
    forms_detected?: boolean;
    forms_count?: number;
    error?: string;
  } | null;
  created_at: string;
  completed_at: string | null;
}

export default function ResultsPage() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tier, setTier] = useState('FREE');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();

  // Safe parameter extraction
  const analysisId = params?.id
    ? Array.isArray(params.id)
      ? params.id[0]
      : params.id
    : null;

  useEffect(() => {
    // Early return if no valid ID
    if (!analysisId) {
      setError('Invalid analysis ID');
      setLoading(false);
      return;
    }

    const loadAnalysis = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('tier')
          .eq('user_id', user.id)
          .maybeSingle();

        if (subscription) {
          setTier(subscription.tier);
        }

        const { data: analysisData, error: analysisError } = await supabase
          .from('analyses')
          .select('*')
          .eq('id', analysisId)
          .maybeSingle();

        if (analysisError || !analysisData) {
          setError('Analysis not found');
          setLoading(false);
          return;
        }

        if (analysisData.user_id !== user.id) {
          setError('You do not have permission to view this analysis');
          setLoading(false);
          return;
        }

        setAnalysis(analysisData as Analysis);
        setLoading(false);

        if (analysisData.status === 'pending' || analysisData.status === 'processing') {
          // Check if analysis is stuck (older than 3 minutes)
          const createdAt = new Date(analysisData.created_at).getTime();
          const now = Date.now();
          const threeMinutes = 3 * 60 * 1000;

          if (now - createdAt > threeMinutes) {
            // Analysis is stuck - mark as failed locally and show error
            setAnalysis({
              ...analysisData,
              status: 'failed',
              insights: {
                error: 'Analysis timed out. Please try again.',
                summary: 'Analysis failed',
                friction_points: [],
              },
            } as Analysis);
            return;
          }

          let pollCount = 0;
          const maxPolls = 90; // 3 minutes max (90 * 2 seconds)

          const interval = setInterval(async () => {
            pollCount++;

            // Stop polling after max attempts
            if (pollCount >= maxPolls) {
              clearInterval(interval);
              setAnalysis(prev => prev ? {
                ...prev,
                status: 'failed',
                insights: {
                  error: 'Analysis timed out. Please try again.',
                  summary: 'Analysis failed',
                  friction_points: [],
                },
              } as Analysis : null);
              return;
            }

            const { data: updatedAnalysis } = await supabase
              .from('analyses')
              .select('*')
              .eq('id', analysisId)
              .maybeSingle();

            if (updatedAnalysis) {
              setAnalysis(updatedAnalysis as Analysis);

              if (updatedAnalysis.status === 'completed' || updatedAnalysis.status === 'failed') {
                clearInterval(interval);
              }
            }
          }, 2000);

          return () => clearInterval(interval);
        }
      } catch (err) {
        console.error('Error loading analysis:', err);
        setError('Failed to load analysis');
        setLoading(false);
      }
    };

    loadAnalysis();
  }, [analysisId, router, supabase]);

  const getScoreColor = (score: number) => {
    if (score <= 30) return 'from-green-500 to-emerald-500';
    if (score <= 60) return 'from-yellow-500 to-amber-500';
    if (score <= 80) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-rose-600';
  };

  const getScoreLabel = (score: number) => {
    if (score <= 30) return 'Excellent';
    if (score <= 60) return 'Good';
    if (score <= 80) return 'Fair';
    return 'Poor';
  };

  const getScoreDescription = (score: number) => {
    if (score <= 30) return 'Minimal friction - your funnel is well optimized!';
    if (score <= 60) return 'Some optimization opportunities identified';
    if (score <= 80) return 'Significant friction points need attention';
    return 'Major friction issues are blocking conversions';
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertCircle className="w-4 h-4" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4" />;
      case 'low':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-400/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/50';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-400/50';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-400/50';
    }
  };

  const handleShareResults = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  const handleDownloadPDF = async () => {
    if (tier.toLowerCase() === 'free') {
      setShowUpgradeModal(true);
      return;
    }

    if (!analysisId) {
      toast.error('Invalid analysis ID');
      return;
    }

    try {
      toast.info('Generating PDF...');

      const response = await fetch(`/api/export-pdf/${analysisId}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `friction-analysis-${analysisId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to download PDF');
    }
  };

  const categorizeIssues = (frictionPoints: FrictionPoint[]) => {
    const categories: Record<string, FrictionPoint[]> = {
      'Form Length': [],
      'Trust Signals': [],
      'CTA Quality': [],
      'Mobile UX': [],
      'Validation UX': [],
      'Privacy Friction': [],
      'Other': [],
    };

    frictionPoints.forEach((point) => {
      const type = point.type.toLowerCase();

      if (type.includes('field') || type.includes('form') || type.includes('length')) {
        categories['Form Length'].push(point);
      } else if (type.includes('trust') || type.includes('badge') || type.includes('security')) {
        categories['Trust Signals'].push(point);
      } else if (type.includes('cta') || type.includes('button') || type.includes('copy')) {
        categories['CTA Quality'].push(point);
      } else if (type.includes('mobile') || type.includes('touch') || type.includes('viewport')) {
        categories['Mobile UX'].push(point);
      } else if (type.includes('validation') || type.includes('error') || type.includes('message')) {
        categories['Validation UX'].push(point);
      } else if (type.includes('privacy') || type.includes('sensitive') || type.includes('personal')) {
        categories['Privacy Friction'].push(point);
      } else {
        categories['Other'].push(point);
      }
    });

    return Object.entries(categories).filter(([_, issues]) => issues.length > 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-cyan-400 mx-auto mb-4" />
          <p className="text-slate-400">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert className="bg-red-500/10 border-red-500/50 text-red-400">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Analysis not found'}</AlertDescription>
        </Alert>
        <div className="mt-6">
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (analysis.status === 'pending' || analysis.status === 'processing') {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl mb-4">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Analysis in Progress
              </h2>
              <p className="text-slate-400">
                We're analyzing {analysis.url} for friction points. This usually takes 10-30 seconds.
              </p>
              <div className="w-full bg-slate-700 rounded-full h-2 mt-6">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full animate-pulse w-3/4"></div>
              </div>
              <p className="text-sm text-slate-500 mt-4">
                This page will automatically update when the analysis is complete
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (analysis.status === 'failed') {
    const errorMessage = analysis.insights?.error || 'Unknown error occurred';
    const isAntiBot = errorMessage.toLowerCase().includes('anti-bot') ||
      errorMessage.toLowerCase().includes('cloudflare') ||
      errorMessage.toLowerCase().includes('403') ||
      errorMessage.toLowerCase().includes('blocks');
    const isTimeout = errorMessage.toLowerCase().includes('timeout');

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Alert className="bg-red-500/10 border-red-500/50 text-red-400">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Analysis failed: {errorMessage}
          </AlertDescription>
        </Alert>

        {isAntiBot && (
          <Card className="bg-slate-800/50 border-yellow-400/30">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-yellow-400 mb-3">💡 This site has bot protection</h3>
              <p className="text-slate-300 mb-4">
                Some websites (like LinkedIn, Facebook, Amazon) use Cloudflare or similar services to block automated tools. Try these alternatives:
              </p>
              <ul className="text-slate-400 space-y-2 text-sm">
                <li>• Analyze a different page on the same site (e.g., /pricing instead of /signup)</li>
                <li>• Try a competitor's site that doesn't have protection</li>
                <li>• Analyze your own website - you have full access!</li>
              </ul>
            </CardContent>
          </Card>
        )}

        {isTimeout && (
          <Card className="bg-slate-800/50 border-yellow-400/30">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-yellow-400 mb-3">⏱️ Analysis timed out</h3>
              <p className="text-slate-300">
                The website took too long to respond. This can happen with slow servers or heavy pages. Try again - it often works on the second attempt.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4">
          <Link href="/dashboard/analyze">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
              Try Another URL
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="border-cyan-400/50 text-cyan-400">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const score = analysis.friction_score || 0;
  const insights = analysis.insights;
  const categorizedIssues = insights?.friction_points
    ? categorizeIssues(insights.friction_points)
    : [];

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Analysis Results
            </span>
          </h1>
          <div className="flex items-center space-x-3 text-slate-400 overflow-hidden">
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
            <a
              href={analysis.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors truncate"
            >
              {analysis.url}
            </a>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-500 mt-2">
            <Clock className="w-4 h-4" />
            <span>
              Analyzed {new Date(analysis.created_at).toLocaleDateString()} at{' '}
              {new Date(analysis.created_at).toLocaleTimeString()}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button
            onClick={handleShareResults}
            variant="outline"
            size="sm"
            className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 text-xs sm:text-sm"
          >
            <Share2 className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button
            onClick={handleDownloadPDF}
            variant="outline"
            size="sm"
            className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 text-xs sm:text-sm"
          >
            <Download className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Download PDF</span>
          </Button>
          <Link href="/dashboard/analyze">
            <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">New Analysis</span>
            </Button>
          </Link>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-cyan-400/30 overflow-hidden">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Overall Friction Score
              </h2>
              <p className="text-slate-400">{insights?.summary || 'Analysis complete'}</p>
            </div>
            <div className="text-center sm:text-right">
              <div
                className={`text-5xl sm:text-6xl font-bold bg-gradient-to-r ${getScoreColor(
                  score
                )} bg-clip-text text-transparent`}
              >
                {score}
              </div>
              <div className="flex items-center justify-end space-x-2 mt-2">
                <Badge
                  className={`${getSeverityColor(
                    score <= 30 ? 'low' : score <= 60 ? 'medium' : 'high'
                  )}`}
                >
                  {getScoreLabel(score)}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>0 (No Friction)</span>
              <span>100 (Max Friction)</span>
            </div>
            <div className="relative w-full h-4 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${getScoreColor(
                  score
                )} transition-all duration-1000`}
                style={{ width: `${score}%` }}
              />
            </div>
            <p className="text-center text-slate-400 text-sm mt-3">
              {getScoreDescription(score)}
            </p>
          </div>

          {insights?.forms_detected && (
            <div className="mt-6 pt-6 border-t border-slate-700">
              <div className="flex items-center space-x-2 text-slate-300">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <span>
                  Detected {insights.forms_count || 0} form
                  {insights.forms_count !== 1 ? 's' : ''} on this page
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Friction Points by Category</h2>

        {categorizedIssues.length === 0 ? (
          <Card className="bg-slate-800/50 backdrop-blur-sm border-green-400/20">
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No Major Issues Found
              </h3>
              <p className="text-slate-400">
                Your funnel looks great! Keep monitoring for opportunities to optimize further.
              </p>
            </CardContent>
          </Card>
        ) : (
          categorizedIssues.map(([category, issues]) => (
            <Card
              key={category}
              className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-white">{category}</span>
                  <Badge className="bg-slate-700 text-slate-300">
                    {issues.length} issue{issues.length !== 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                {issues.map((issue, index) => (
                  <div
                    key={index}
                    className="p-4 sm:p-6 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-cyan-400/30 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-0 mb-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg ${issue.severity === 'high'
                            ? 'bg-red-500/20'
                            : issue.severity === 'medium'
                              ? 'bg-yellow-500/20'
                              : 'bg-green-500/20'
                            }`}
                        >
                          {getSeverityIcon(issue.severity)}
                        </div>
                        <div>
                          <h4 className="text-base sm:text-lg font-semibold text-white">
                            {issue.type}
                          </h4>
                        </div>
                      </div>
                      <Badge className={getSeverityColor(issue.severity)}>
                        {issue.severity.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="space-y-4 sm:ml-11">
                      <div>
                        <p className="text-sm font-medium text-slate-400 mb-2">
                          Issue:
                        </p>
                        <p className="text-slate-200">{issue.description}</p>
                      </div>

                      <div className="pt-4 border-t border-slate-700">
                        <p className="text-sm font-medium text-cyan-400 mb-2">
                          Recommendation:
                        </p>
                        <p className="text-slate-300">{issue.recommendation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Card className="bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 border border-cyan-400/20">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-cyan-500/20 rounded-lg flex-shrink-0">
              <Sparkles className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                Ready to optimize your funnel?
              </h3>
              <p className="text-slate-400 mb-4">
                Implement these recommendations to reduce friction and boost your conversion rate.
                Run another analysis after making changes to track your improvements.
              </p>
              <Link href="/dashboard/analyze">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
                  Analyze Another Page
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        feature="PDF Export"
        requiredTier="starter"
        description="Download professional PDF reports of your friction analysis. Perfect for sharing with your team or clients."
      />
    </div>
  );
}