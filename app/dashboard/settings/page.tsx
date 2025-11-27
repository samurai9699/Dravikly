'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  AlertCircle,
  Calendar,
  CreditCard,
  Key,
  Loader2,
  Mail,
  Settings as SettingsIcon,
  Shield,
  Trash2,
  User,
  BarChart3,
  ExternalLink,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface Subscription {
  tier: string;
  paddle_subscription_id: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [analysisCount, setAnalysisCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = useSearchParams()?.get('tab') ?? 'account';
  const supabase = createClient();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: { user: userData }, error: authError } = await supabase.auth.getUser();
        if (authError || !userData) {
          router.push('/login');
          return;
        }

        setUser(userData);

        const { data: subData, error: subError } = await supabase
          .from('subscriptions')
          .select('tier, paddle_subscription_id, current_period_end, cancel_at_period_end')
          .eq('user_id', userData.id)
          .maybeSingle();

        if (subError) {
          console.error('Error loading subscription:', subError);
        } else {
          setSubscription(subData as Subscription);
        }

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { count, error: countError } = await supabase
          .from('analyses')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userData.id)
          .gte('created_at', startOfMonth.toISOString());

        if (!countError) {
          setAnalysisCount(count || 0);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error loading settings:', err);
        setLoading(false);
      }
    };

    loadUserData();
  }, [router, supabase]);

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'FREE':
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-400/50">Free</Badge>;
      case 'PRO':
        return <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-400/50">Pro</Badge>;
      case 'ULTRA':
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-400/50">Ultra</Badge>;
      default:
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-400/50">{tier}</Badge>;
    }
  };

  const handleChangePassword = async () => {
    if (!user?.email) return;

    setPasswordChangeLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success('Password reset email sent! Check your inbox.');
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Failed to send password reset email. Please try again.');
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    setActionLoading(true);
    try {
      const { error: deleteError } = await supabase
        .from('subscriptions')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) {
        console.error('Error deleting subscription:', deleteError);
      }

      const { error: analysesError } = await supabase
        .from('analyses')
        .delete()
        .eq('user_id', user.id);

      if (analysesError) {
        console.error('Error deleting analyses:', analysesError);
      }

      await supabase.auth.signOut();

      toast.success('Account deleted successfully');
      router.push('/');
    } catch (error) {
      console.error('Delete account error:', error);
      toast.error('Failed to delete account. Please contact support.');
      setActionLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setActionLoading(true);
    try {
      // Direct users to contact support or cancel via settings
      toast.info('To manage your subscription, please contact support or cancel below');
      setActionLoading(false);

      // Alternative: Open Paddle customer portal if you have subscription ID
      // const paddleSubscriptionId = subscription?.paddle_subscription_id;
      // if (paddleSubscriptionId) {
      //   window.open(`https://sandbox-subscription-management.paddle.com/subscriptions/${paddleSubscriptionId}`, '_blank');
      // }
    } catch (error) {
      console.error('Portal error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to open billing portal');
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <div className="h-10 w-48 bg-slate-700 rounded animate-pulse mb-2" />
          <div className="h-6 w-80 bg-slate-700 rounded animate-pulse" />
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-400/20 rounded-lg p-6">
            <div className="h-6 w-40 bg-slate-700 rounded animate-pulse mb-6" />
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-slate-700">
                <div className="h-4 w-24 bg-slate-700 rounded animate-pulse" />
                <div className="h-6 w-48 bg-slate-700 rounded animate-pulse" />
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-700">
                <div className="h-4 w-24 bg-slate-700 rounded animate-pulse" />
                <div className="h-6 w-32 bg-slate-700 rounded animate-pulse" />
              </div>
              <div className="flex justify-between items-center py-3">
                <div className="h-4 w-32 bg-slate-700 rounded animate-pulse" />
                <div className="h-6 w-20 bg-slate-700 rounded animate-pulse" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-400/20 rounded-lg p-6">
            <div className="h-6 w-32 bg-slate-700 rounded animate-pulse mb-6" />
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-slate-700">
                <div className="h-4 w-48 bg-slate-700 rounded animate-pulse" />
                <div className="h-10 w-32 bg-slate-700 rounded animate-pulse" />
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-700">
                <div className="h-4 w-40 bg-slate-700 rounded animate-pulse" />
                <div className="h-10 w-32 bg-slate-700 rounded animate-pulse" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-red-400/20 rounded-lg p-6">
            <div className="h-6 w-32 bg-slate-700 rounded animate-pulse mb-4" />
            <div className="h-4 w-full bg-slate-700 rounded animate-pulse mb-6" />
            <div className="h-10 w-40 bg-slate-700 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Settings
          </span>
        </h1>
        <p className="text-slate-400">Manage your account, billing, and preferences</p>
      </div>

      <Tabs defaultValue={initialTab} className="space-y-6">
        <TabsList className="bg-slate-800/50 border border-slate-700">
          <TabsTrigger
            value="account"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
          >
            <User className="w-4 h-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Billing
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
          >
            <SettingsIcon className="w-4 h-4 mr-2" />
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Mail className="w-5 h-5 mr-2 text-cyan-400" />
                Email Address
              </CardTitle>
              <CardDescription className="text-slate-400">
                Your primary email address for login and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <Mail className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-white font-medium">{user?.email}</span>
                </div>
                <Badge className="bg-slate-700 text-slate-300">Read-only</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Key className="w-5 h-5 mr-2 text-cyan-400" />
                Password
              </CardTitle>
              <CardDescription className="text-slate-400">
                Change your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleChangePassword}
                disabled={passwordChangeLoading}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
              >
                {passwordChangeLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending Email...
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4 mr-2" />
                    Change Password
                  </>
                )}
              </Button>
              <p className="text-sm text-slate-500 mt-3">
                We'll send you an email with instructions to reset your password
              </p>
            </CardContent>
          </Card>

          <Card className="bg-red-500/5 backdrop-blur-sm border-red-400/20">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Danger Zone
              </CardTitle>
              <CardDescription className="text-slate-400">
                Irreversible actions that affect your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="bg-red-500/10 border-red-500/50 text-red-400 mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Deleting your account will permanently remove all your data, including analyses and
                  billing information. This action cannot be undone.
                </AlertDescription>
              </Alert>
              <Button
                onClick={() => setDeleteDialogOpen(true)}
                variant="outline"
                className="border-red-400/50 text-red-400 hover:bg-red-400/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-cyan-400" />
                  Current Plan
                </div>
                {getTierBadge(subscription?.tier || 'FREE')}
              </CardTitle>
              <CardDescription className="text-slate-400">
                Your subscription details and billing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subscription?.tier !== 'FREE' && subscription?.current_period_end && (
                  <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                    <div className="flex items-center space-x-3 mb-2">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm text-slate-400">Next Billing Date</span>
                    </div>
                    <p className="text-white font-semibold">
                      {new Date(subscription.current_period_end).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    {subscription.cancel_at_period_end && (
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-400/50 mt-2">
                        Cancels at period end
                      </Badge>
                    )}
                  </div>
                )}

                <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                  <div className="flex items-center space-x-3 mb-2">
                    <BarChart3 className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-slate-400">Analyses This Month</span>
                  </div>
                  <p className="text-white font-semibold text-2xl">{analysisCount}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {subscription?.tier === 'FREE' && '5 per month limit'}
                    {subscription?.tier === 'PRO' && '50 per month limit'}
                    {subscription?.tier === 'ULTRA' && 'Unlimited'}
                  </p>
                </div>
              </div>

              {subscription?.tier === 'FREE' ? (
                <div className="p-6 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-lg border border-cyan-400/30">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Unlock More Features
                  </h3>
                  <p className="text-slate-400 mb-4">
                    Upgrade to Pro or Ultra to get unlimited analyses, PDF exports, and priority
                    support.
                  </p>
                  <Button
                    onClick={() => router.push('/pricing')}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Plans
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleManageSubscription}
                  disabled={actionLoading}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Opening Portal...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Manage Subscription
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20">
            <CardHeader>
              <CardTitle className="text-white">Plan Features</CardTitle>
              <CardDescription className="text-slate-400">
                What's included in your current plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {subscription?.tier === 'FREE' && (
                  <>
                    <div className="flex items-center space-x-3 text-slate-300">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                      <span>5 analyses per month</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-300">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                      <span>View last 5 analyses</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-300">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                      <span>Basic friction analysis</span>
                    </div>
                  </>
                )}
                {subscription?.tier === 'PRO' && (
                  <>
                    <div className="flex items-center space-x-3 text-slate-300">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                      <span>50 analyses per month</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-300">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                      <span>Unlimited history access</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-300">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                      <span>PDF export reports</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-300">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                      <span>Priority email support</span>
                    </div>
                  </>
                )}
                {subscription?.tier === 'ULTRA' && (
                  <>
                    <div className="flex items-center space-x-3 text-slate-300">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                      <span>Unlimited analyses</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-300">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                      <span>Unlimited history access</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-300">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                      <span>PDF export reports</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-300">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                      <span>API access</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-300">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                      <span>Priority support + Slack access</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Bell className="w-5 h-5 mr-2 text-cyan-400" />
                Notifications
              </CardTitle>
              <CardDescription className="text-slate-400">
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications" className="text-white font-medium cursor-pointer">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-slate-400">
                    Receive email updates when your analysis is complete
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                  className="data-[state=checked]:bg-cyan-500"
                />
              </div>

              <Alert className="bg-cyan-500/10 border-cyan-400/50">
                <AlertCircle className="h-4 w-4 text-cyan-400" />
                <AlertDescription className="text-slate-300">
                  Email notifications are currently enabled. You'll receive updates when your friction
                  analyses are completed.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20">
            <CardHeader>
              <CardTitle className="text-white">About</CardTitle>
              <CardDescription className="text-slate-400">
                Application information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-slate-300">
                <span>Version</span>
                <span className="text-white font-mono">1.0.0</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Last Updated</span>
                <span className="text-white">November 2025</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-900 border-red-400/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-red-400" />
              Delete Account
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This action cannot be undone. This will permanently delete your account and remove all
              your data from our servers, including:
              <ul className="list-disc list-inside mt-3 space-y-1 text-slate-300">
                <li>All friction analyses</li>
                <li>Analysis history</li>
                <li>Subscription information</li>
                <li>Account preferences</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={actionLoading}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
