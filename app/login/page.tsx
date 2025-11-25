'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Logo } from '@/components/Logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  // Check for auth errors from callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authError = params.get('error');
    if (authError === 'auth_failed') {
      setError('Authentication failed. Please try again.');
    } else if (authError === 'unexpected') {
      setError('An unexpected error occurred. Please try again.');
    }
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      if (data.user) {
        // Use replace instead of push to avoid back button issues
        router.replace('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
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
      <div className="relative z-10 w-full max-w-md">
        <Link href="/">
          <div className="flex items-center justify-center space-x-3 mb-8 cursor-pointer group">
            <Logo className="w-10 h-10 transition-transform group-hover:scale-110" />
            <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Dravikly
            </span>
          </div>
        </Link>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">Welcome back</h1>
          <p className="text-slate-400 text-center mb-8">Sign in to your account</p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-200">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-slate-200">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center justify-end">
              <Link href="/forgot-password" className="text-sm text-cyan-400 hover:text-cyan-300">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-800 text-slate-400">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 px-4 bg-slate-900/50 border border-slate-700 hover:bg-slate-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {loading ? 'Connecting...' : 'Continue with Google'}
            </div>
          </button>

          <div className="mt-8 text-center">
            <p className="text-slate-400">
              Don't have an account?{' '}
              <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}