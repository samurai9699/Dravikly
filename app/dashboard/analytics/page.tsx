import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, BarChart3, Globe, Shield } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

async function getAnalytics() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - 7);

  const [
    { count: totalUsers },
    { count: analysesToday },
    { count: analysesThisWeek },
    { data: tierBreakdown },
    { data: topDomains },
  ] = await Promise.all([
    supabaseAdmin
      .from('subscriptions')
      .select('*', { count: 'exact', head: true }),

    supabaseAdmin
      .from('analyses')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', todayStart.toISOString()),

    supabaseAdmin
      .from('analyses')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekStart.toISOString()),

    supabaseAdmin
      .from('subscriptions')
      .select('tier')
      .then(result => {
        if (result.error || !result.data) return { data: [] };
        const breakdown = result.data.reduce((acc: any, sub: any) => {
          acc[sub.tier] = (acc[sub.tier] || 0) + 1;
          return acc;
        }, {});
        return { data: breakdown };
      }),

    supabaseAdmin
      .from('analyses')
      .select('url')
      .then(result => {
        if (result.error || !result.data) return { data: [] };
        const domainCounts: { [key: string]: number } = {};
        result.data.forEach((analysis: any) => {
          try {
            const domain = new URL(analysis.url).hostname;
            domainCounts[domain] = (domainCounts[domain] || 0) + 1;
          } catch (e) {
            console.error('Invalid URL:', analysis.url);
          }
        });
        const sorted = Object.entries(domainCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10)
          .map(([domain, count]) => ({ domain, count }));
        return { data: sorted };
      }),
  ]);

  return {
    totalUsers: totalUsers || 0,
    analysesToday: analysesToday || 0,
    analysesThisWeek: analysesThisWeek || 0,
    tierBreakdown: tierBreakdown || { FREE: 0, PRO: 0, ULTRA: 0 },
    topDomains: topDomains || [],
  };
}

export default async function AnalyticsPage() {
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

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail || user.email !== adminEmail) {
    redirect('/dashboard');
  }

  const analytics = await getAnalytics();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Platform-wide metrics and insights
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              All registered accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analyses Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.analysesToday}</div>
            <p className="text-xs text-muted-foreground">
              Completed in last 24h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.analysesThisWeek}</div>
            <p className="text-xs text-muted-foreground">
              Last 7 days activity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Daily</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(analytics.analysesThisWeek / 7)}
            </div>
            <p className="text-xs text-muted-foreground">
              Analyses per day
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Tier Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                  <span className="text-sm font-medium">Free</span>
                </div>
                <span className="text-2xl font-bold">
                  {analytics.tierBreakdown.FREE || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                  <span className="text-sm font-medium">Pro</span>
                </div>
                <span className="text-2xl font-bold">
                  {analytics.tierBreakdown.PRO || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium">Ultra</span>
                </div>
                <span className="text-2xl font-bold">
                  {analytics.tierBreakdown.ULTRA || 0}
                </span>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-sm">Conversion Rate</span>
                  <span className="text-lg font-semibold">
                    {analytics.totalUsers > 0
                      ? (
                          ((analytics.tierBreakdown.PRO || 0) +
                            (analytics.tierBreakdown.ULTRA || 0)) /
                          analytics.totalUsers *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Top Analyzed Domains
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topDomains.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No analyses yet
                </p>
              ) : (
                analytics.topDomains.map((item: any, index: number) => (
                  <div
                    key={item.domain}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-muted-foreground w-5">
                        #{index + 1}
                      </span>
                      <span className="text-sm font-medium truncate max-w-[200px]">
                        {item.domain}
                      </span>
                    </div>
                    <span className="text-sm font-bold">{item.count}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
