'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Shield, TrendingUp, Users, Scan, Wrench, FileText, CheckCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export default function Home() {
  const [founderCount, setFounderCount] = useState(0);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        setFounderCount(data.total_users || 0);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setFounderCount(500);
      }
    }

    fetchStats();
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
                      {founderCount > 0 ? (
                        <>Join {founderCount}+ founders</>
                      ) : (
                        <>Join 500+ founders</>
                      )}
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
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Stop guessing.{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Start converting.
              </span>
            </h2>
            <p className="text-xl text-slate-400">
              Everything you need to eliminate friction and boost conversions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Scan,
                title: 'Instant Friction Detection',
                description: 'AI analyzes your forms in 30 seconds',
                gradient: 'from-cyan-500 to-blue-500',
              },
              {
                icon: Wrench,
                title: 'Actionable Fixes',
                description: 'Get specific rewrites and UI changes',
                gradient: 'from-blue-500 to-purple-500',
              },
              {
                icon: TrendingUp,
                title: 'Conversion Impact Score',
                description: 'See predicted lift from each fix',
                gradient: 'from-purple-500 to-pink-500',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-slate-800/30 backdrop-blur-sm border border-cyan-400/20 rounded-xl p-8 hover:border-cyan-400/50 transition-all duration-300 hover:transform hover:-translate-y-2"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-slate-400">
              From URL to insights in under a minute
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-1/4 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

            {[
              {
                step: 1,
                icon: FileText,
                title: 'Paste URL',
                description: 'Enter your landing page or form URL',
              },
              {
                step: 2,
                icon: Scan,
                title: 'AI Scans Forms',
                description: 'Advanced AI analyzes every friction point',
              },
              {
                step: 3,
                icon: TrendingUp,
                title: 'Get Detailed Report',
                description: 'Receive prioritized list of issues',
              },
              {
                step: 4,
                icon: CheckCircle,
                title: 'Fix & Convert More',
                description: 'Implement changes and watch conversions soar',
              },
            ].map((step, index) => (
              <div
                key={index}
                className="relative bg-slate-800/30 backdrop-blur-sm border border-cyan-400/20 rounded-xl p-6 hover:border-cyan-400/50 transition-all duration-300"
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center font-bold text-sm border-4 border-slate-900 z-10">
                  {step.step}
                </div>
                <div className="mt-6 flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-bold">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Simple,{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                transparent pricing
              </span>
            </h2>
            <p className="text-xl text-slate-400">
              Choose the plan that fits your conversion goals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Free',
                price: '$0',
                period: 'forever',
                analyses: 3,
                features: [
                  '3 analyses per day',
                  'Basic friction detection',
                  'Email support',
                ],
                cta: 'Start Free',
                highlighted: false,
              },
              {
                name: 'Pro',
                price: '$29',
                period: 'per month',
                analyses: 20,
                features: [
                  '20 analyses per day',
                  'Advanced AI insights',
                  'Priority support',
                  'Export reports',
                ],
                cta: 'Start Pro Trial',
                highlighted: true,
                popular: true,
              },
              {
                name: 'Ultra',
                price: '$99',
                period: 'per month',
                analyses: 'Unlimited',
                features: [
                  'Unlimited analyses',
                  'White-label reports',
                  'Dedicated support',
                  'API access',
                ],
                cta: 'Start Ultra Trial',
                highlighted: false,
              },
            ].map((tier, index) => (
              <div
                key={index}
                className={`relative group ${
                  tier.highlighted
                    ? 'md:scale-105 z-10'
                    : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-bold px-4 py-1 rounded-full">
                      Most Popular
                    </div>
                  </div>
                )}
                <div
                  className={`relative h-full bg-slate-800/50 backdrop-blur-sm border rounded-2xl p-8 transition-all duration-300 ${
                    tier.highlighted
                      ? 'border-cyan-400/50 shadow-lg shadow-cyan-400/20'
                      : 'border-cyan-400/20 hover:border-cyan-400/40'
                  } group-hover:shadow-2xl group-hover:shadow-cyan-400/20`}
                >
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                    <div className="flex items-baseline">
                      <span className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        {tier.price}
                      </span>
                      <span className="text-slate-400 ml-2">/{tier.period}</span>
                    </div>
                  </div>

                  <div className="mb-6 pb-6 border-b border-slate-700">
                    <div className="flex items-center justify-center space-x-2 text-lg">
                      <TrendingUp className="w-5 h-5 text-cyan-400" />
                      <span className="font-semibold">
                        {typeof tier.analyses === 'number' ? `${tier.analyses} analyses` : tier.analyses}
                      </span>
                      <span className="text-slate-400">per day</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      tier.highlighted
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    }`}
                    size="lg"
                  >
                    {tier.cta}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/pricing">
              <Button
                variant="outline"
                size="lg"
                className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10"
              >
                See Full Pricing Details
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="max-w-4xl mx-auto mt-32 text-center">
          <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-400/30 rounded-2xl p-12">
            <h2 className="text-4xl font-bold mb-6">
              Ready to eliminate friction?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Join hundreds of founders who have already optimized their conversion funnels
            </p>
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-lg px-12 py-6 group"
              >
                Start Your Free Analysis
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
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
