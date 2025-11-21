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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { UsageIndicator } from '@/components/dashboard/usage-indicator';

interface Analysis {
  id: string;
  url: string;
  status: string;
  friction_score: number | null;
  created_at: string;
}

interface Subscription {
  tier: string;
  analyses_used_today: number;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [totalAnalyses, setTotalAnalyses] = useState(0);
  const [recentAnalyses, setRecentAnalyses] = useState<Analysis[]>([]);
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

        const [subscriptionResult, analysesResult, recentResult] = await Promise.all([
          supabase
            .from('subscriptions')
            .select('tier, analyses_used_today')
            .eq('user_id', user.id)
            .maybeSingle(),
          supabase
            .from('analyses')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id),
          supabase
            .from('analyses')
            .select('id, url, status, friction_score, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5),
        ]);

        if (subscriptionResult.data) {
          setSubscription(subscriptionResult.data);
        }

        setTotalAnalyses(analysesResult.count || 0);

        if (recentResult.data) {
          setRecentAnalyses(recentResult.data);
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
    switch (tier) {
      case 'PRO':
        return 20;
      case 'ULTRA':
        return 'Unlimited';
      default:
        return 3;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'PRO':
        return 'from-cyan-500 to-blue-500';
      case 'ULTRA':
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
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">
          Welcome back,{' '}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            {userName}
          </span>
        </h1>
        <p className="text-slate-400 text-lg">
          Let's eliminate some friction from your funnels
        </p>
      </div>

      <UsageIndicator
        tier={subscription?.tier || 'FREE'}
        analysesUsedToday={subscription?.analyses_used_today || 0}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20 hover:border-cyan-400/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Analyses Today
            </CardTitle>
            <TrendingUp className="w-5 h-5 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">
              {subscription?.analyses_used_today || 0}
              <span className="text-slate-400 text-lg">
                {' '}/ {getAnalysisLimit(subscription?.tier || 'FREE')}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {subscription?.tier === 'ULTRA'
                ? 'Unlimited analyses available'
                : `${
                    typeof getAnalysisLimit(subscription?.tier || 'FREE') === 'number'
                      ? (getAnalysisLimit(subscription?.tier || 'FREE') as number) -
                        (subscription?.analyses_used_today || 0)
                      : 'Unlimited'
                  } remaining today`}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20 hover:border-cyan-400/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Total Analyses
            </CardTitle>
            <BarChart3 className="w-5 h-5 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">
              {totalAnalyses}
            </div>
            <p className="text-xs text-slate-400">
              All-time friction reports
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20 hover:border-cyan-400/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Current Plan
            </CardTitle>
            <Crown className="w-5 h-5 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="mb-2">
              <span
                className={`text-2xl font-bold bg-gradient-to-r ${getTierColor(
                  subscription?.tier || 'FREE'
                )} bg-clip-text text-transparent`}
              >
                {subscription?.tier || 'FREE'}
              </span>
            </div>
            {subscription?.tier === 'FREE' ? (
              <Link href="/pricing">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-xs"
                >
                  Upgrade Now
                </Button>
              </Link>
            ) : (
              <p className="text-xs text-slate-400">
                Premium features unlocked
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-400/30 rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to analyze?</h2>
        <p className="text-slate-300 mb-6 text-lg">
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
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recent Analyses</h2>
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

        {recentAnalyses.length === 0 ? (
          <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Clock className="w-16 h-16 text-slate-600 mb-4" />
              <h3 className="text-xl font-semibold text-slate-300 mb-2">
                No analyses yet
              </h3>
              <p className="text-slate-400 mb-6 text-center">
                Run your first analysis to start eliminating friction
              </p>
              <Link href="/dashboard/analyze">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
                  Get Started
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {recentAnalyses.map((analysis) => (
              <Card
                key={analysis.id}
                className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20 hover:border-cyan-400/40 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <a
                          href={analysis.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg font-semibold text-white hover:text-cyan-400 transition-colors flex items-center group"
                        >
                          {analysis.url.length > 60
                            ? analysis.url.substring(0, 60) + '...'
                            : analysis.url}
                          <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-slate-400">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatDate(analysis.created_at)}
                        </span>
                        <Badge className={getStatusColor(analysis.status)}>
                          {analysis.status}
                        </Badge>
                      </div>
                    </div>
                    {analysis.friction_score !== null && (
                      <div className="ml-4 text-right">
                        <p className="text-sm text-slate-400 mb-1">Friction Score</p>
                        <div
                          className={`text-3xl font-bold ${
                            analysis.friction_score < 30
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
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
