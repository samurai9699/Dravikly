'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Shield, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export default function Home() {
  const [founderCount, setFounderCount] = useState(500);

  useEffect(() => {
    const interval = setInterval(() => {
      setFounderCount((prev) => {
        const next = prev + Math.floor(Math.random() * 3);
        return next > 550 ? 500 : next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
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

      <nav className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-cyan-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              FrictionKiller
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:text-cyan-400">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-6 py-20">
        <section className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-800/50 border border-cyan-400/30 rounded-full">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-cyan-400">AI-Powered Analysis</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Find the{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  invisible friction
                </span>{' '}
                killing your conversions
              </h1>

              <p className="text-xl text-slate-300 leading-relaxed">
                AI-powered analysis reveals exactly why visitors leave without buying.
                Get actionable insights in minutes, not weeks.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-lg px-8 py-6 group"
                  >
                    Analyze My Site Free
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="#demo">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 text-lg px-8 py-6"
                  >
                    Watch Demo
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 border-2 border-slate-900" />
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-slate-900" />
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 border-2 border-slate-900" />
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-red-500 border-2 border-slate-900" />
                </div>
                <div className="text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span className="font-semibold">
                      Trusted by {founderCount}+ founders
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 blur-3xl rounded-full" />
              <div className="relative bg-slate-800/50 backdrop-blur-sm border border-cyan-400/30 rounded-2xl p-8 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <span className="text-sm text-slate-400">Analysis Dashboard</span>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">Friction Score</span>
                        <span className="text-2xl font-bold text-cyan-400">73/100</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-cyan-400 to-blue-400 h-2 rounded-full transition-all duration-1000"
                          style={{ width: '73%' }}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        { issue: 'Too many form fields', severity: 'high', color: 'text-red-400' },
                        { issue: 'Missing trust signals', severity: 'medium', color: 'text-yellow-400' },
                        { issue: 'Weak CTA copy', severity: 'medium', color: 'text-yellow-400' },
                        { issue: 'Mobile optimization', severity: 'low', color: 'text-green-400' },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 flex items-center justify-between opacity-0 animate-in fade-in slide-in-from-left"
                          style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${item.color}`} />
                            <span className="text-sm text-slate-300">{item.issue}</span>
                          </div>
                          <span className={`text-xs font-semibold uppercase ${item.color}`}>
                            {item.severity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto mt-32">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'Instant Analysis',
                description: 'Get comprehensive friction analysis in under 60 seconds',
              },
              {
                icon: TrendingUp,
                title: 'Actionable Insights',
                description: 'Specific fixes ranked by impact on conversion rate',
              },
              {
                icon: Shield,
                title: 'Battle-Tested',
                description: 'Proven frameworks used by top converting sites',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-slate-800/30 backdrop-blur-sm border border-cyan-400/20 rounded-xl p-8 hover:border-cyan-400/50 transition-all duration-300 hover:transform hover:-translate-y-1"
              >
                <feature.icon className="w-12 h-12 text-cyan-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 container mx-auto px-6 py-12 mt-32 border-t border-slate-800">
        <div className="text-center text-slate-400">
          <p>&copy; 2025 FrictionKiller. Built for conversion-obsessed founders.</p>
        </div>
      </footer>
    </div>
  );
}
