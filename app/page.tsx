'use client';

import Link from 'next/link';
import { ArrowRight, Zap, TrendingUp, Users, Scan, Wrench, FileText, CheckCircle, Check, ShoppingCart, UserPlus, Mail, DollarSign, HelpCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export default function Home() {
  const [founderCount, setFounderCount] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [animatedStats, setAnimatedStats] = useState({
    conversionLift: 0,
    analyses: 0,
    founders: 0,
    rating: 0,
  });
  const [demoUrl, setDemoUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [demoResults, setDemoResults] = useState<any[]>([]);
  const [scrollY, setScrollY] = useState(0);

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

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateValue('conversionLift', 0, 34, 2000);
            animateValue('analyses', 0, 10000, 2000);
            animateValue('founders', 0, 500, 2000);
            animateValue('rating', 0, 4.9, 2000);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    const statsElement = document.getElementById('stats-section');
    if (statsElement) {
      observer.observe(statsElement);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach((el) => revealObserver.observe(el));

    return () => revealObserver.disconnect();
  }, []);

  const animateValue = (key: string, start: number, end: number, duration: number) => {
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuad = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * easeOutQuad;

      setAnimatedStats((prev) => ({
        ...prev,
        [key]: current,
      }));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  const handleDemoAnalyze = async () => {
    if (!demoUrl || isAnalyzing) return;

    setIsAnalyzing(true);
    setDemoResults([]);

    const mockResults = [
      { issue: 'Form has 12 fields (optimal: 5-7)', severity: 'high', color: 'text-red-400', delay: 800 },
      { issue: 'No trust badges visible', severity: 'medium', color: 'text-yellow-400', delay: 1400 },
      { issue: 'CTA button text is generic', severity: 'medium', color: 'text-yellow-400', delay: 2000 },
      { issue: 'Missing progress indicator', severity: 'low', color: 'text-green-400', delay: 2600 },
    ];

    for (const result of mockResults) {
      await new Promise(resolve => setTimeout(resolve, result.delay));
      setDemoResults(prev => [...prev, result]);
    }

    setTimeout(() => setIsAnalyzing(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {scrollY > 600 && (
        <div className="fixed bottom-8 right-8 z-50 animate-fade-in-up">
          <a href="#demo">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-2xl shadow-cyan-400/30 hover:shadow-cyan-400/50 transition-all hover:scale-105"
            >
              <Zap className="w-5 h-5 mr-2" />
              Try Demo
            </Button>
          </a>
        </div>
      )}

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
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:scale-110">
                <defs>
                  <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                {/* Outer circle representing analysis/scanning */}
                <circle cx="20" cy="20" r="18" stroke="url(#logo-gradient)" strokeWidth="2" fill="none" opacity="0.3" />
                {/* Inner dynamic shape representing optimization/flow */}
                <path
                  d="M 12 20 Q 16 12, 20 20 T 28 20"
                  stroke="url(#logo-gradient)"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
                {/* Data points representing insights */}
                <circle cx="12" cy="20" r="2.5" fill="url(#logo-gradient)" />
                <circle cx="20" cy="20" r="2.5" fill="url(#logo-gradient)" />
                <circle cx="28" cy="20" r="2.5" fill="url(#logo-gradient)" />
                {/* Upward arrow representing conversion lift */}
                <path
                  d="M 20 28 L 20 16 M 16 20 L 20 16 L 24 20"
                  stroke="url(#logo-gradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.8"
                />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Dravikly
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:text-cyan-400">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="absolute top-20 left-10 w-20 h-20 bg-cyan-400/10 rounded-full blur-xl animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-20 w-32 h-32 bg-blue-400/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-60 left-1/4 w-16 h-16 bg-purple-400/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />

        <section className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-800/50 border border-cyan-400/30 rounded-full">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-cyan-400">AI-Powered Analysis</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
                Find the{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  invisible friction
                </span>{' '}
                killing your conversions
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed">
                AI-powered analysis reveals exactly why visitors leave without buying.
                Get actionable insights in minutes, not weeks.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 group"
                  >
                    Analyze My Site Free
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

              </div>

              <div className="flex items-center space-x-3 pt-4">
                <div className="flex -space-x-2">
                  <img
                    src="https://i.pravatar.cc/150?img=51"
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover"
                  />
                  <img
                    src="https://i.pravatar.cc/150?img=47"
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover"
                  />
                  <img
                    src="https://i.pravatar.cc/150?img=32"
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover"
                  />
                  <img
                    src="https://i.pravatar.cc/150?img=59"
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover"
                  />
                </div>
                <div className="text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span className="font-semibold">
                      Join{" "}
                      <span className="tabular-nums">
                        {founderCount > 400 ? `${founderCount}+` : "500+"}
                      </span>{" "}
                      founders
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="relative"
              style={{
                transform: `translateY(${scrollY * 0.1}px)`,
                transition: 'transform 0.1s ease-out',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 blur-3xl rounded-full animate-pulse" />
              <div className="relative bg-slate-800/50 backdrop-blur-sm border border-cyan-400/30 rounded-2xl p-8 shadow-2xl hover:border-cyan-400/50 transition-all duration-300">
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" style={{ animationDelay: '150ms' }} />
                      <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-sm text-slate-400">Analysis Dashboard</span>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 hover:border-cyan-400/30 transition-colors group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">Friction Score</span>
                        <span className="text-2xl font-bold text-cyan-400 tabular-nums">74/100</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-cyan-400 to-blue-400 h-2 rounded-full transition-all duration-1000 relative"
                          style={{ width: '74%' }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        { issue: 'Too many form fields', severity: 'high', color: 'text-red-400', bgColor: 'bg-red-400/10', borderColor: 'border-red-400/20' },
                        { issue: 'Missing trust signals', severity: 'medium', color: 'text-yellow-400', bgColor: 'bg-yellow-400/10', borderColor: 'border-yellow-400/20' },
                        { issue: 'Weak CTA copy', severity: 'medium', color: 'text-yellow-400', bgColor: 'bg-yellow-400/10', borderColor: 'border-yellow-400/20' },
                        { issue: 'Mobile optimization', severity: 'low', color: 'text-green-400', bgColor: 'bg-green-400/10', borderColor: 'border-green-400/20' },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 flex items-center justify-between opacity-0 animate-in fade-in slide-in-from-left hover:border-slate-600 transition-all group"
                          style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${item.color} animate-pulse`} style={{ animationDelay: `${index * 100}ms` }} />
                            <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{item.issue}</span>
                          </div>
                          <span className={`text-xs font-semibold uppercase ${item.color} px-2 py-1 rounded ${item.bgColor} border ${item.borderColor}`}>
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

        <section id="demo" className="max-w-4xl mx-auto mt-32 scroll-reveal">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-cyan-400/30 rounded-2xl p-8 sm:p-12 shadow-2xl hover:border-cyan-400/50 transition-all">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-3">
                Try it{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  right now
                </span>
              </h2>
              <p className="text-slate-400">
                Enter any URL to see how our AI detects friction points
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="url"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="https://yoursite.com/checkout"
                  className="flex-1 px-6 py-4 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && handleDemoAnalyze()}
                />
                <Button
                  onClick={handleDemoAnalyze}
                  disabled={!demoUrl || isAnalyzing}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Scan className="w-5 h-5 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>

              {(isAnalyzing || demoResults.length > 0) && (
                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700 min-h-[200px]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Friction Analysis</h3>
                    {isAnalyzing && (
                      <div className="flex items-center space-x-2 text-cyan-400 text-sm">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                        <span>Scanning...</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {demoResults.map((result, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700 animate-in fade-in slide-in-from-left"
                        style={{ animationDuration: '300ms' }}
                      >
                        <div className="flex items-start space-x-3 flex-1">
                          <div className={`w-2 h-2 rounded-full ${result.color} mt-2 animate-pulse`} />
                          <div>
                            <p className="text-slate-200 text-sm">{result.issue}</p>
                            <p className="text-slate-500 text-xs mt-1">
                              {result.severity === 'high' && '🔴 High impact on conversions'}
                              {result.severity === 'medium' && '🟡 Medium impact on conversions'}
                              {result.severity === 'low' && '🟢 Low impact on conversions'}
                            </p>
                          </div>
                        </div>
                        <span className={`text-xs font-semibold uppercase ${result.color} px-2 py-1 rounded bg-slate-900 border border-slate-700`}>
                          {result.severity}
                        </span>
                      </div>
                    ))}

                    {!isAnalyzing && demoResults.length === 0 && (
                      <div className="text-center py-12 text-slate-500">
                        <Scan className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Enter a URL above to start the demo analysis</p>
                      </div>
                    )}
                  </div>

                  {!isAnalyzing && demoResults.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-slate-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-400">Friction Score</p>
                          <p className="text-3xl font-bold text-yellow-400">68/100</p>
                        </div>
                        <Link href="/signup">
                          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
                            Get Full Report
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <p className="text-center text-sm text-slate-500">
                ✨ This is a demo. Sign up for real AI-powered analysis of your site.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto mt-32 scroll-reveal">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
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
                className="group relative bg-slate-800/30 backdrop-blur-sm border border-cyan-400/20 rounded-xl p-8 hover:border-cyan-400/50 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-lg hover:shadow-cyan-400/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 to-blue-400/0 group-hover:from-cyan-400/5 group-hover:to-blue-400/5 rounded-xl transition-all duration-300" />
                <div className="relative">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-cyan-400 transition-colors">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto mt-32 scroll-reveal">
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

        <section className="max-w-6xl mx-auto mt-32 scroll-reveal">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Loved by{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                conversion-obsessed founders
              </span>
            </h2>
            <p className="text-xl text-slate-400">
              See what our users are saying about their results
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Dravikly found 7 friction points I completely missed. Fixed them and saw a 34% lift in conversions within a week.",
                author: "Sarah Chen",
                role: "Founder, ConvertKit Clone",
                avatar: "https://i.pravatar.cc/150?img=44",
                rating: 5,
              },
              {
                quote: "The AI insights are scary accurate. It's like having a CRO expert on call 24/7. Worth every penny.",
                author: "Marcus Rodriguez",
                role: "Head of Growth, SaaS Startup",
                avatar: "https://i.pravatar.cc/150?img=13",
                rating: 5,
              },
              {
                quote: "We were bleeding users at checkout. One analysis revealed our form was way too long. Cut it by 60% and conversions doubled.",
                author: "Emily Watson",
                role: "CEO, E-commerce Brand",
                avatar: "https://i.pravatar.cc/150?img=49",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="group bg-slate-800/30 backdrop-blur-sm border border-cyan-400/20 rounded-xl p-8 hover:border-cyan-400/50 transition-all duration-300 hover:transform hover:-translate-y-2"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-300 leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center space-x-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400/30"
                  />
                  <div>
                    <div className="font-semibold text-white">{testimonial.author}</div>
                    <div className="text-sm text-slate-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div id="stats-section" className="mt-16 bg-slate-800/30 backdrop-blur-sm border border-cyan-400/20 rounded-xl p-8 hover:border-cyan-400/40 transition-colors">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2 tabular-nums">
                  {Math.round(animatedStats.conversionLift)}%
                </div>
                <div className="text-slate-400">Avg. Conversion Lift</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2 tabular-nums">
                  {animatedStats.analyses >= 1000 ? `${(animatedStats.analyses / 1000).toFixed(1)}k` : Math.round(animatedStats.analyses)}+
                </div>
                <div className="text-slate-400">Analyses Run</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2 tabular-nums">
                  {Math.round(animatedStats.founders)}+
                </div>
                <div className="text-slate-400">Happy Founders</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2 tabular-nums">
                  {animatedStats.rating.toFixed(1)}/5
                </div>
                <div className="text-slate-400">User Rating</div>
              </div>
            </div>
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
                className={`relative group ${tier.highlighted
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
                  className={`relative h-full bg-slate-800/50 backdrop-blur-sm border rounded-2xl p-8 transition-all duration-300 ${tier.highlighted
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
                    className={`w-full ${tier.highlighted
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

        <section className="max-w-6xl mx-auto mt-32 scroll-reveal">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Perfect for{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                every conversion funnel
              </span>
            </h2>
            <p className="text-xl text-slate-400">
              Optimize any customer journey in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ShoppingCart,
                title: 'E-commerce Checkouts',
                description: 'Reduce cart abandonment by identifying friction in your checkout flow',
                gradient: 'from-cyan-500 to-blue-500',
                stat: '2.3x avg. completion rate',
              },
              {
                icon: UserPlus,
                title: 'SaaS Signups',
                description: 'Streamline onboarding forms and boost trial-to-paid conversions',
                gradient: 'from-blue-500 to-purple-500',
                stat: '47% more signups',
              },
              {
                icon: Mail,
                title: 'Lead Generation',
                description: 'Maximize form submissions with optimized lead capture pages',
                gradient: 'from-purple-500 to-pink-500',
                stat: '3.1x more leads',
              },
            ].map((useCase, index) => (
              <div
                key={index}
                className="bg-slate-800/30 backdrop-blur-sm border border-cyan-400/20 rounded-xl p-8 hover:border-cyan-400/50 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${useCase.gradient} flex items-center justify-center mb-6`}>
                  <useCase.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{useCase.title}</h3>
                <p className="text-slate-400 leading-relaxed mb-4">{useCase.description}</p>
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-cyan-400 font-semibold">{useCase.stat}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Dravikly vs.{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Traditional CRO
              </span>
            </h2>
            <p className="text-xl text-slate-400">
              See why smart founders choose AI-powered analysis
            </p>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm border border-cyan-400/20 rounded-xl overflow-hidden hover:border-cyan-400/40 transition-colors">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-900/30">
                    <th className="text-left p-6 text-slate-400 font-medium">Feature</th>
                    <th className="text-center p-6">
                      <div className="flex flex-col items-center">
                        <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-2">
                          <defs>
                            <linearGradient id="logo-gradient-table" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#06b6d4" />
                              <stop offset="100%" stopColor="#3b82f6" />
                            </linearGradient>
                          </defs>
                          <circle cx="20" cy="20" r="18" stroke="url(#logo-gradient-table)" strokeWidth="2" fill="none" opacity="0.3" />
                          <path
                            d="M 12 20 Q 16 12, 20 20 T 28 20"
                            stroke="url(#logo-gradient-table)"
                            strokeWidth="2.5"
                            fill="none"
                            strokeLinecap="round"
                            className="animate-pulse"
                          />
                          <circle cx="12" cy="20" r="2.5" fill="url(#logo-gradient-table)" />
                          <circle cx="20" cy="20" r="2.5" fill="url(#logo-gradient-table)" />
                          <circle cx="28" cy="20" r="2.5" fill="url(#logo-gradient-table)" />
                          <path
                            d="M 20 28 L 20 16 M 16 20 L 20 16 L 24 20"
                            stroke="url(#logo-gradient-table)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity="0.8"
                          />
                        </svg>
                        <span className="font-bold text-white">Dravikly</span>
                      </div>
                    </th>
                    <th className="text-center p-6 text-slate-400 font-medium">CRO Agency</th>
                    <th className="text-center p-6 text-slate-400 font-medium">Manual Audit</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Analysis Time', dravikly: '30 seconds', agency: '2-4 weeks', manual: '4-8 hours', icon: '⚡' },
                    { feature: 'Cost', dravikly: '$0-99/mo', agency: '$5k-20k', manual: 'Your time', icon: '💰' },
                    { feature: 'Accuracy', dravikly: 'AI-powered', agency: 'Expert-based', manual: 'Hit or miss', icon: '🎯' },
                    { feature: 'Actionable Fixes', dravikly: 'Yes', agency: 'Yes', manual: 'Maybe', icon: '🔧' },
                    { feature: 'Unlimited Analyses', dravikly: 'Yes (Ultra)', agency: 'No', manual: 'Yes', icon: '♾️' },
                  ].map((row, index) => (
                    <tr key={index} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-800/50 transition-colors group">
                      <td className="p-6 text-slate-300 font-medium">
                        <span className="mr-2 opacity-60 group-hover:opacity-100 transition-opacity">{row.icon}</span>
                        {row.feature}
                      </td>
                      <td className="p-6 text-center">
                        <div className="inline-flex items-center justify-center px-4 py-2 bg-cyan-500/20 border border-cyan-400/50 rounded-lg hover:bg-cyan-500/30 hover:border-cyan-400/70 transition-all hover:scale-105">
                          <span className="text-cyan-400 font-semibold">{row.dravikly}</span>
                        </div>
                      </td>
                      <td className="p-6 text-center text-slate-400 group-hover:text-slate-300 transition-colors">{row.agency}</td>
                      <td className="p-6 text-center text-slate-400 group-hover:text-slate-300 transition-colors">{row.manual}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">ROI Guarantee</h3>
                <p className="text-slate-300">
                  If our analysis doesn't find at least 3 actionable friction points that could improve your conversions,
                  we'll refund your first month. No questions asked.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Frequently Asked{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-xl text-slate-400">
              Everything you need to know about Dravikly
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: 'How accurate is the AI analysis?',
                answer: 'Our AI is trained on thousands of high-converting funnels and CRO best practices. It identifies friction points with 94% accuracy compared to manual expert audits, and often catches issues humans miss.',
              },
              {
                question: 'Do I need to install anything on my site?',
                answer: 'Nope! Just paste your URL and we analyze it. No code installation, no tracking scripts, no technical setup required. Works with any website or landing page.',
              },
              {
                question: 'How long does an analysis take?',
                answer: 'Most analyses complete in 30-60 seconds. You will get a detailed report with friction scores, specific issues, and actionable recommendations immediately.',
              },
              {
                question: 'What if I do not like the results?',
                answer: 'We guarantee you will find at least 3 actionable insights in every analysis. If not, contact us within 30 days for a full refund. We are that confident in our AI.',
              },
              {
                question: 'Can I analyze competitor sites?',
                answer: 'Absolutely! Many of our users analyze competitor funnels to understand what is working in their industry. It is a great way to benchmark and find opportunities.',
              },
              {
                question: 'What is the difference between plans?',
                answer: 'Free gives you 3 analyses per day with basic insights. Pro offers 20 per day with advanced AI recommendations and export features. Ultra provides unlimited analyses, API access, and white-label reports for agencies.',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-slate-800/30 backdrop-blur-sm border border-cyan-400/20 rounded-xl overflow-hidden hover:border-cyan-400/40 transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-cyan-400 transition-transform duration-200 ${openFaq === index ? 'transform rotate-180' : ''
                      }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 pl-18">
                    <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
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
            <p className="text-slate-400 mt-4 text-sm">
              No credit card required • 3 free analyses daily • Upgrade anytime
            </p>
          </div>
        </section>
      </main>

      <footer className="relative z-10 container mx-auto px-6 py-12 mt-32 border-t border-slate-800">
        <div className="text-center text-slate-400">
          <p>&copy; 2025 Dravikly. Built for conversion-obsessed founders.</p>
        </div>
      </footer>
    </div>
  );
}
