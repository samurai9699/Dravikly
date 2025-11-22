'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import {
  Home,
  Plus,
  Clock,
  Settings,
  CreditCard,
  Shield,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';

interface LayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [tier, setTier] = useState('FREE');
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      setUserEmail(user.email || '');

      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('tier')
        .eq('user_id', user.id)
        .maybeSingle();

      if (subscription) {
        setTier(subscription.tier);
      }
    };

    loadUser();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
    },
    {
      name: 'New Analysis',
      href: '/dashboard/analyze',
      icon: Plus,
    },
    {
      name: 'History',
      href: '/dashboard/history',
      icon: Clock,
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
    },
    {
      name: 'Billing',
      href: '/dashboard/billing',
      icon: CreditCard,
    },
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'PRO':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-400/50';
      case 'ULTRA':
        return 'bg-purple-500/20 text-purple-400 border-purple-400/50';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-400/50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="absolute inset-0 opacity-5">
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

      <div className="relative z-10 flex h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-800/50 backdrop-blur-sm border-r border-cyan-400/20 transform transition-transform duration-300 lg:translate-x-0 lg:static ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <Link href="/dashboard">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <Shield className="w-8 h-8 text-cyan-400" />
                  <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Dravikly
                  </span>
                </div>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <div
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/50'
                          : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-700">
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 rounded-lg p-4 mb-4">
                <p className="text-sm text-slate-400 mb-2">Current Plan</p>
                <Badge className={`${getTierColor(tier)} font-bold`}>
                  {tier}
                </Badge>
                {tier === 'FREE' && (
                  <Link href="/pricing">
                    <Button
                      className="w-full mt-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-sm"
                      size="sm"
                    >
                      Upgrade Plan
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-slate-800/30 backdrop-blur-sm border-b border-cyan-400/20 p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-slate-400 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div className="flex items-center space-x-4 ml-auto">
                <div className="hidden sm:block text-right">
                  <p className="text-sm text-slate-400">Signed in as</p>
                  <p className="text-sm font-medium text-white">{userEmail}</p>
                </div>

                <Badge className={`${getTierColor(tier)} hidden sm:inline-flex`}>
                  {tier}
                </Badge>

                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
