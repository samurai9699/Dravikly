'use client';

import Link from 'next/link';
import { AlertCircle, Zap, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface UsageIndicatorProps {
  tier: string;
  analysesUsedThisMonth: number;
  monthlyLimit: number | string;
}

export function UsageIndicator({ tier, analysesUsedThisMonth, monthlyLimit }: UsageIndicatorProps) {
  const isUnlimited = monthlyLimit === 'Unlimited' || monthlyLimit === -1;
  const limit = typeof monthlyLimit === 'number' ? monthlyLimit : null;

  if (isUnlimited || limit === null) {
    return (
      <Card className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 border border-purple-400/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  Unlimited Access
                </h3>
                <p className="text-sm text-slate-300">
                  {analysesUsedThisMonth} analyses this month
                </p>
              </div>
            </div>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-400/50 text-lg px-4 py-2">
              UNLIMITED
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  const percentage = (analysesUsedThisMonth / limit) * 100;
  const remaining = Math.max(0, limit - analysesUsedThisMonth);
  const isLimitReached = analysesUsedThisMonth >= limit;

  const getProgressColor = () => {
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusIcon = () => {
    if (isLimitReached) {
      return <AlertCircle className="w-6 h-6 text-red-400" />;
    }
    if (percentage >= 80) {
      return <AlertCircle className="w-6 h-6 text-yellow-400" />;
    }
    return <TrendingUp className="w-6 h-6 text-green-400" />;
  };

  const getStatusText = () => {
    if (isLimitReached) {
      return 'Monthly limit reached';
    }
    if (percentage >= 80) {
      return 'Approaching monthly limit';
    }
    return 'Monthly usage';
  };

  return (
    <Card
      className={`border transition-colors ${isLimitReached
        ? 'bg-red-500/5 border-red-400/30'
        : percentage >= 80
          ? 'bg-yellow-500/5 border-yellow-400/30'
          : 'bg-slate-800/50 border-cyan-400/20'
        }`}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`p-3 rounded-lg ${isLimitReached
                  ? 'bg-red-500/20'
                  : percentage >= 80
                    ? 'bg-yellow-500/20'
                    : 'bg-green-500/20'
                  }`}
              >
                {getStatusIcon()}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {getStatusText()}
                </h3>
                <p className="text-sm text-slate-300">
                  {analysesUsedThisMonth} of {limit} analyses this month
                </p>
              </div>
            </div>
            <div className="text-right">
              <div
                className={`text-3xl font-bold ${isLimitReached
                  ? 'text-red-400'
                  : percentage >= 80
                    ? 'text-yellow-400'
                    : 'text-green-400'
                  }`}
              >
                {remaining}
              </div>
              <p className="text-sm text-slate-400">remaining</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative w-full h-3 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${getProgressColor()} transition-all duration-300 ease-in-out`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>0</span>
              <span className="font-semibold">
                {analysesUsedThisMonth} / {limit}
              </span>
              <span>{limit}</span>
            </div>
          </div>

          {isLimitReached ? (
            <div className="pt-4 border-t border-slate-700">
              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-400/30 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-400 mb-1">
                      Monthly limit reached
                    </p>
                    <p className="text-sm text-slate-300">
                      Upgrade your plan to analyze more pages this month and unlock premium features
                    </p>
                  </div>
                </div>
              </div>
              <Link href="/pricing">
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
                  Upgrade to Analyze More Today
                </Button>
              </Link>
            </div>
          ) : percentage >= 80 ? (
            <div className="pt-4 border-t border-slate-700">
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/30 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-yellow-400 mb-1">
                      Running low on analyses
                    </p>
                    <p className="text-sm text-slate-300">
                      Consider upgrading for more daily analyses and advanced features
                    </p>
                  </div>
                </div>
              </div>
              <Link href="/pricing">
                <Button
                  variant="outline"
                  className="w-full border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10"
                >
                  View Upgrade Options
                </Button>
              </Link>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
