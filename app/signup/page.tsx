'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createClient } from '@/lib/supabase/client';
import { Logo } from '@/components/Logo';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.user) {
        // Check if subscription already exists
        const { data: existingSubscription } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('user_id', data.user.id)
          .maybeSingle();

        if (!existingSubscription) {
          const { error: subscriptionError } = await supabase
            .from('subscriptions')
            .insert({
              user_id: data.user.id,
              tier: 'FREE',
              status: 'active',
            });

          if (subscriptionError) {
            console.error('Error creating subscription:', subscriptionError);
          }
        }

        // Send welcome email (don't wait for it)
        fetch('/api/auth/welcome', {
          method: 'POST',
        }).catch(err => console.error('Failed to send welcome email:', err));

        // Use replace instead of push to avoid back button issues
        router.replace('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError('');

    try {
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
      }
      // Don't set loading to false here - let the redirect happen
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6">
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="norse-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M50 0 L50 100 M0 50 L100 50" stroke="currentColor" strokeWidth="0.5" fill="none" />
              <path d="M25 25 L75 25 L75 75 L25 75 Z" stroke="currentColor" strokeWidth="0.5" fill="none" />
              <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="0.5" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#norse-pattern)" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Link href="/">
          <div className="flex items-center justify-center space-x-3 mb-8 cursor-pointer group">
            <Logo className="w-10 h-10 transition-transform group-hover:scale-110" />
            <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Dravikly
            </span>
          </div>
        </Link>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-8 shadow-2xl shadow-cyan-400/10">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">Create your account</h1>
          <p className="text-slate-400 text-center mb-8">Start eliminating friction today</p>

          {error && (
            <Alert className="mb-6 bg-red-500/10 border-red-500/50 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mb-6 bg-cyan-500/10 border border-cyan-400/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-cyan-400 font-semibold">Free tier includes:</p>
                <ul className="text-sm text-slate-300 mt-2 space-y-1">
                  <li>• 3 analyses per day</li>
                  <li>• Basic friction reports</li>
                  <li>• Community support</li>
                </ul>
              </div>
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-slate-900/50 border-slate-700 focus:border-cyan-400 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 bg-slate-900/50 border-slate-700 focus:border-cyan-400 text-white"
                />
              </div>
              <p className="text-xs text-slate-400">Must be at least 6 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-200">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pl-10 bg-slate-900/50 border-slate-700 focus:border-cyan-400 text-white"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
              size="lg"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-800 text-slate-400">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full bg-slate-900/50 border-slate-700 hover:bg-slate-700 text-white"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {loading ? 'Connecting...' : 'Continue with Google'}
          </Button>

          <div className="mt-8 text-center">
            <p className="text-slate-400">
              Already have an account?{' '}
              <Link href="/login">
                <span className="text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer">
                  Sign in
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
