'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  BarChart3,
  Crown,
  ArrowRight,
  Clock,
  ExternalLink,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  Activity,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { UsageIndicator } from '@/components/dashboard/usage-indicator';
import { UpgradeModal } from '@/components/upgrade-modal';
import { FrictionChart } from '@/components/dashboard/friction-chart';

interface Analysis {
  id: string;
  url: string;
  status: string;
  friction_score: number | null;
  created_at: string;
  insights?: any;
}

interface Subscription {
  tier: string;
  status: string;
}

interface FrictionTrend {
  date: string;
  score: number;
}

interface TopIssue {
  issue: string;
  count: number;
  severity: 'high' | 'medium' | 'low';
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [totalAnalyses, setTotalAnalyses] = useState(0);
  const [monthlyAnalysesUsed, setMonthlyAnalysesUsed] = useState(0);
  const [recentAnalyses, setRecentAnalyses] = useState<Analysis[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [avgFrictionScore, setAvgFrictionScore] = useState<number | null>(null);
  const [frictionTrend, setFrictionTrend] = useState<FrictionTrend[]>([]);
  const [topIssues, setTopIssues] = useState<TopIssue[]>([]);
  const [totalIssuesFound, setTotalIssuesFound] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const emailName = user.email?.split('@')[0] || 'User';
        setUserName(emailName.charAt(0).toUpperCase() + emailName.slice(1));

        // Get start of current month for monthly usage
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const [subscriptionResult, analysesResult, monthlyUsageResult, recentResult, allAnalysesResult] = await Promise.all([
          supabase
            .from('subscriptions')
            .select('tier, status')
            .eq('user_id', user.id)
            .maybeSingle(),
          supabase
            .from('analyses')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id),
          supabase
            .from('analyses')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .gte('created_at', monthStart.toISOString()),
          supabase
            .from('analyses')
            .select('id, url, status, friction_score, created_at, insights')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5),
          supabase
            .from('analyses')
            .select('friction_score, created_at, insights')
            .eq('user_id', user.id)
            .eq('status', 'completed')
            .order('created_at', { ascending: false })
            .limit(30),
        ]);

        if (subscriptionResult.data) {
          setSubscription(subscriptionResult.data);
        }

        setTotalAnalyses(analysesResult.count || 0);
        setMonthlyAnalysesUsed(monthlyUsageResult.count || 0);

        if (recentResult.data) {
          setRecentAnalyses(recentResult.data);
        }

        // Calculate average friction score and trends
        if (allAnalysesResult.data && allAnalysesResult.data.length > 0) {
          const completedAnalyses = allAnalysesResult.data.filter(a => a.friction_score !== null);

          console.log('Dashboard Debug:', {
            totalAnalyses: allAnalysesResult.data.length,
            completedWithScore: completedAnalyses.length,
            sampleData: completedAnalyses.slice(0, 2)
          });

          if (completedAnalyses.length > 0) {
            // Calculate average
            const avg = completedAnalyses.reduce((sum, a) => sum + (a.friction_score || 0), 0) / completedAnalyses.length;
            setAvgFrictionScore(Math.round(avg));

            // Build trend data (last 10 analyses for better visualization)
            const trendData = completedAnalyses.slice(0, 10).reverse().map((a) => ({
              date: new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              score: a.friction_score || 0,
            }));

            // Only set trend if we have at least 1 data point
            if (trendData.length > 0) {
              console.log('Setting friction trend data:', trendData);
              setFrictionTrend(trendData);
            }

            // Extract top issues from insights
            const issuesMap = new Map<string, { count: number; severity: 'high' | 'medium' | 'low' }>();
            let totalIssues = 0;

            completedAnalyses.forEach(analysis => {
              if (analysis.insights && typeof analysis.insights === 'object') {
                const insights = analysis.insights;

                // Try to extract issues from different possible structures
                let issues: any[] = [];
                if (Array.isArray(insights)) {
                  issues = insights;
                } else if (insights.issues && Array.isArray(insights.issues)) {
                  issues = insights.issues;
                } else if (insights.friction_points && Array.isArray(insights.friction_points)) {
                  issues = insights.friction_points;
                }

                issues.forEach((issue: any) => {
                  totalIssues++;

                  // Extract description and severity from the friction point
                  const issueText = issue.description || issue.issue || issue.title || '';
                  const severity = (issue.severity || 'medium').toLowerCase() as 'high' | 'medium' | 'low';

                  if (issueText) {
                    // Normalize for grouping (first 100 chars to group similar issues)
                    const normalizedText = issueText.substring(0, 100).trim();
                    const existing = issuesMap.get(normalizedText);

                    if (existing) {
                      existing.count++;
                      // Keep the highest severity
                      if (severity === 'high' || (severity === 'medium' && existing.severity === 'low')) {
                        existing.severity = severity;
                      }
                    } else {
                      issuesMap.set(normalizedText, { count: 1, severity });
                    }
                  }
                });
              }
            });

            setTotalIssuesFound(totalIssues);

            // Get top 3 issues by frequency and severity
            const topIssuesArray = Array.from(issuesMap.entries())
              .map(([issue, data]) => ({ issue, count: data.count, severity: data.severity }))
              .sort((a, b) => {
                // Sort by count first, then by severity
                if (b.count !== a.count) return b.count - a.count;
                const severityOrder = { high: 3, medium: 2, low: 1 };
                return severityOrder[b.severity] - severityOrder[a.severity];
              })
              .slice(0, 3);

            setTopIssues(topIssuesArray);
          }
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [router, supabase]);

  const getAnalysisLimit = (tier: string) => {
    const tierLower = tier.toLowerCase();
    switch (tierLower) {
      case 'free':
        return 5;
      case 'starter':
        return 60;
      case 'pro':
        return 300;
      case 'enterprise':
        return 'Unlimited';
      default:
        return 5;
    }
  };

  const getTierColor = (tier: string) => {
    const tierLower = tier.toLowerCase();
    switch (tierLower) {
      case 'starter':
        return 'from-cyan-500 to-blue-500';
      case 'pro':
        return 'from-blue-500 to-purple-500';
      case 'enterprise':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-400/50';
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/50';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-400/50';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-400/50';
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-10 w-64 bg-slate-700 rounded animate-pulse mb-2" />
            <div className="h-6 w-96 bg-slate-700 rounded animate-pulse" />
          </div>
          <div className="h-12 w-40 bg-slate-700 rounded animate-pulse" />
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-400/20 rounded-lg p-6">
          <div className="h-4 w-32 bg-slate-700 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-800/50 backdrop-blur-sm border border-cyan-400/20 rounded-lg p-6">
              <div className="h-10 w-10 bg-slate-700 rounded animate-pulse mb-3" />
              <div className="h-8 w-24 bg-slate-700 rounded animate-pulse mb-2" />
              <div className="h-3 w-32 bg-slate-700 rounded animate-pulse" />
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-400/20 rounded-lg p-6 h-80">
            <div className="h-6 w-32 bg-slate-700 rounded animate-pulse mb-4" />
            <div className="h-full bg-slate-700/50 rounded animate-pulse" />
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-400/20 rounded-lg p-6 h-80">
            <div className="h-6 w-32 bg-slate-700 rounded animate-pulse mb-4" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-700/50 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back,{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {userName}
            </span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg">
            Let's eliminate some friction from your funnels
          </p>
        </div>
        <Link href="/dashboard/analyze">
          <Button
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white group shadow-lg shadow-cyan-500/20"
          >
            <Zap className="w-5 h-5 mr-2" />
            New Analysis
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      {/* Usage Indicator */}
      <UsageIndicator
        tier={subscription?.tier || 'free'}
        analysesUsedThisMonth={monthlyAnalysesUsed}
        monthlyLimit={getAnalysisLimit(subscription?.tier || 'free')}
      />

      {/* Hero Stats - 4 Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Average Friction Score */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20 hover:border-cyan-400/40 transition-all hover:shadow-lg hover:shadow-cyan-500/10 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Activity className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="text-sm font-medium text-slate-300">Avg. Friction</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1 tabular-nums">
              {avgFrictionScore !== null ? avgFrictionScore : '—'}
              {avgFrictionScore !== null && <span className="text-lg text-slate-400">/100</span>}
            </div>
            <p className="text-xs text-slate-400">
              {avgFrictionScore !== null
                ? avgFrictionScore < 40
                  ? '🟢 Excellent - Low friction'
                  : avgFrictionScore < 70
                    ? '🟡 Good - Room for improvement'
                    : '🔴 High - Needs attention'
                : 'Run analyses to see score'}
            </p>
          </CardContent>
        </Card>

        {/* Total Analyses */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20 hover:border-cyan-400/40 transition-all hover:shadow-lg hover:shadow-blue-500/10 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-sm font-medium text-slate-300">Total Scans</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1 tabular-nums">
              {totalAnalyses}
            </div>
            <p className="text-xs text-slate-400">
              {totalAnalyses === 0 ? 'Start your first analysis' : 'Friction reports completed'}
            </p>
          </CardContent>
        </Card>

        {/* Issues Found */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20 hover:border-cyan-400/40 transition-all hover:shadow-lg hover:shadow-yellow-500/10 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                </div>
                <span className="text-sm font-medium text-slate-300">Issues Found</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1 tabular-nums">
              {totalIssuesFound}
            </div>
            <p className="text-xs text-slate-400">
              {totalIssuesFound === 0 ? 'No issues detected yet' : 'Friction points identified'}
            </p>
          </CardContent>
        </Card>

        {/* Current Plan */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20 hover:border-cyan-400/40 transition-all hover:shadow-lg hover:shadow-purple-500/10 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Crown className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-sm font-medium text-slate-300">Plan</span>
              </div>
            </div>
            <div className="mb-2">
              <span
                className={`text-2xl font-bold bg-gradient-to-r ${getTierColor(
                  subscription?.tier || 'FREE'
                )} bg-clip-text text-transparent`}
              >
                {subscription?.tier || 'FREE'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {subscription?.tier === 'FREE' ? 'Upgrade for more power' : 'Premium active'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid - Trend Chart & Top Issues */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Friction Trend Chart */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20 hover:border-cyan-400/40 transition-colors">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-cyan-400" />
                Friction Trend
              </CardTitle>
              {frictionTrend.length > 1 && (
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-400/50">
                  Last {frictionTrend.length} analyses
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {frictionTrend.length > 0 ? (
              <>
                <FrictionChart data={frictionTrend} />
                {frictionTrend.length === 1 && (
                  <p className="text-xs text-slate-400 text-center mt-2">
                    Complete more analyses to see your trend over time
                  </p>
                )}
                <div className="mt-2 text-xs text-slate-500 text-center">
                  Showing {frictionTrend.length} data point{frictionTrend.length !== 1 ? 's' : ''}
                </div>
              </>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center px-4">
                <TrendingUp className="w-16 h-16 text-slate-600 mb-4" />
                <h3 className="text-lg font-semibold text-slate-300 mb-2">No trend data yet</h3>
                <p className="text-sm text-slate-400 mb-4 max-w-sm">
                  {totalAnalyses === 0
                    ? 'Run your first analysis to start tracking friction trends'
                    : 'Complete your pending analyses to see friction trends'}
                </p>
                <Link href="/dashboard/analyze">
                  <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
                    {totalAnalyses === 0 ? 'Run First Analysis' : 'Run New Analysis'}
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Issues */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20 hover:border-cyan-400/40 transition-colors">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
              Most Common Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topIssues.length > 0 ? (
              <div className="space-y-4">
                {topIssues.map((issue, index) => (
                  <div
                    key={index}
                    className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm text-slate-200 leading-relaxed">
                          {issue.issue.length > 80 ? issue.issue.substring(0, 80) + '...' : issue.issue}
                        </p>
                      </div>
                      <Badge className={`ml-3 ${getSeverityColor(issue.severity)}`}>
                        {issue.severity}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                      <span className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 mr-1.5" />
                        Found {issue.count} {issue.count === 1 ? 'time' : 'times'}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="pt-2">
                  <Link href="/dashboard/history">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10"
                    >
                      View All Analyses
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center">
                <Sparkles className="w-16 h-16 text-slate-600 mb-4" />
                <h3 className="text-lg font-semibold text-slate-300 mb-2">No issues found yet</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Run analyses to discover friction points
                </p>
                <Link href="/dashboard/analyze">
                  <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
                    Start Analyzing
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Upgrade CTA */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Action Card */}
        <Card className="bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 border-cyan-400/30 hover:border-cyan-400/50 transition-all">
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full mb-4">
              <Zap className="w-8 h-8 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Ready to analyze?</h2>
            <p className="text-slate-300 mb-6">
              Discover friction points in your funnel and get AI-powered recommendations
            </p>
            <Link href="/dashboard/analyze">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white group"
              >
                Run New Analysis
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Upgrade CTA (only for non-Enterprise users) */}
        {subscription?.tier?.toLowerCase() !== 'enterprise' && (
          <Card className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-purple-500/10 border-purple-400/30 hover:border-purple-400/50 transition-all">
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full mb-4">
                <Crown className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Unlock Ultra Power</h3>
              <p className="text-slate-300 mb-6">
                Get unlimited analyses, competitive benchmarking, and API access
              </p>
              <Button
                onClick={() => setShowUpgradeModal(true)}
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white group"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Discover Ultra
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Achievement Card (for Enterprise users) */}
        {subscription?.tier?.toLowerCase() === 'enterprise' && (
          <Card className="bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 border-green-400/30 hover:border-green-400/50 transition-all">
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full mb-4">
                <Award className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">You're on Enterprise! 🎉</h3>
              <p className="text-slate-300 mb-6">
                Enjoying unlimited analyses, white-label reports, and premium features
              </p>
              <Link href="/dashboard/settings">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-green-400/50 text-green-400 hover:bg-green-400/10"
                >
                  Manage Subscription
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Analyses */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center">
              <Clock className="w-5 h-5 mr-2 text-cyan-400" />
              Recent Analyses
            </CardTitle>
            {recentAnalyses.length > 0 && (
              <Link href="/dashboard/history">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10"
                >
                  View All
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {recentAnalyses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 rounded-full bg-slate-700/50 flex items-center justify-center mb-4">
                <Clock className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-300 mb-2">
                No analyses yet
              </h3>
              <p className="text-slate-400 mb-6 max-w-md">
                Run your first analysis to start eliminating friction and boosting conversions
              </p>
              <Link href="/dashboard/analyze">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
                  <Zap className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAnalyses.map((analysis) => (
                <div
                  key={analysis.id}
                  onClick={() => router.push(`/dashboard/results/${analysis.id}`)}
                  className="bg-slate-900/50 rounded-lg p-5 border border-slate-700 hover:border-cyan-400/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <a
                          href={analysis.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-base font-semibold text-white hover:text-cyan-400 transition-colors flex items-center group/link truncate"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="truncate">
                            {analysis.url.length > 50
                              ? analysis.url.substring(0, 50) + '...'
                              : analysis.url}
                          </span>
                          <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0" />
                        </a>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-slate-400">
                        <span className="flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1.5" />
                          {formatDate(analysis.created_at)}
                        </span>
                        <Badge className={getStatusColor(analysis.status)}>
                          {analysis.status}
                        </Badge>
                      </div>
                    </div>
                    {analysis.friction_score !== null && (
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-slate-400 mb-1">Friction Score</p>
                        <div
                          className={`text-3xl font-bold tabular-nums ${analysis.friction_score < 30
                            ? 'text-green-400'
                            : analysis.friction_score < 70
                              ? 'text-yellow-400'
                              : 'text-red-400'
                            }`}
                        >
                          {analysis.friction_score}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        feature="Competitive Benchmarking"
        requiredTier="ULTRA"
        description="Compare your friction score against competitors. Get unlimited analyses, priority processing, API access, and white-label reports."
      />
    </div>
  );
}
