import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Target,
  Zap,
  FileText,
  Clock,
  Users,
  Lock,
  Smartphone,
  BarChart3,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Logo } from '@/components/Logo';

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="guide-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M50 0 L50 100 M0 50 L100 50" stroke="currentColor" strokeWidth="0.5" fill="none" />
              <path d="M25 25 L75 25 L75 75 L25 75 Z" stroke="currentColor" strokeWidth="0.5" fill="none" />
              <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="0.5" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#guide-pattern)" />
        </svg>
      </div>

      <div className="relative z-10">
        <header className="border-b border-cyan-400/20 bg-slate-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/">
                <div className="flex items-center space-x-3 cursor-pointer group">
                  <Logo className="w-8 h-8 transition-transform group-hover:scale-110" />
                  <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Dravikly
                  </span>
                </div>
              </Link>
              <Link href="/login">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Dravikly Guide
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Learn how to use AI-powered friction analysis to optimize your conversion funnels and boost revenue
            </p>
          </div>

          <div className="space-y-16">
            <section>
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-cyan-400" />
                </div>
                <h2 className="text-3xl font-bold">How to Use Dravikly</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20">
                  <CardHeader>
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-cyan-400">1</span>
                    </div>
                    <CardTitle className="text-white">Enter Your URL</CardTitle>
                    <CardDescription className="text-slate-400">
                      Input any webpage URL you want to analyze for friction
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                        Landing pages
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                        Signup forms
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                        Checkout flows
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                        Contact forms
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20">
                  <CardHeader>
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-cyan-400">2</span>
                    </div>
                    <CardTitle className="text-white">AI Analysis</CardTitle>
                    <CardDescription className="text-slate-400">
                      Our AI scans your page for conversion-killing friction
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start">
                        <Zap className="w-4 h-4 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                        Analysis in under 30 seconds
                      </li>
                      <li className="flex items-start">
                        <Zap className="w-4 h-4 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                        6 friction categories
                      </li>
                      <li className="flex items-start">
                        <Zap className="w-4 h-4 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                        Severity scoring
                      </li>
                      <li className="flex items-start">
                        <Zap className="w-4 h-4 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                        Best practice checks
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20">
                  <CardHeader>
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-cyan-400">3</span>
                    </div>
                    <CardTitle className="text-white">Get Insights</CardTitle>
                    <CardDescription className="text-slate-400">
                      Receive actionable recommendations to fix issues
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start">
                        <TrendingUp className="w-4 h-4 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                        Prioritized by severity
                      </li>
                      <li className="flex items-start">
                        <TrendingUp className="w-4 h-4 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                        Specific fix suggestions
                      </li>
                      <li className="flex items-start">
                        <TrendingUp className="w-4 h-4 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                        Track improvements over time
                      </li>
                      <li className="flex items-start">
                        <TrendingUp className="w-4 h-4 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                        Export PDF reports (PRO+)
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-cyan-400" />
                </div>
                <h2 className="text-3xl font-bold">Friction Types We Detect</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <FileText className="w-6 h-6 text-cyan-400" />
                      <CardTitle className="text-white">Form Complexity</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-slate-300">
                      Forms are a critical conversion point. We detect:
                    </p>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        Too many required fields
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        Unclear or missing labels
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        No progress indicators
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        Poor error messaging
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        Missing autofill support
                      </li>
                    </ul>
                    <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-lg p-3 mt-4">
                      <p className="text-xs text-cyan-300">
                        <strong>Impact:</strong> Complex forms can reduce conversions by up to 67%
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Lock className="w-6 h-6 text-cyan-400" />
                      <CardTitle className="text-white">Trust Signals</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-slate-300">
                      Users need to trust you before converting. We check for:
                    </p>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        Missing security badges
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        No customer testimonials
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        Absent privacy policy links
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        No social proof
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        Missing company information
                      </li>
                    </ul>
                    <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-lg p-3 mt-4">
                      <p className="text-xs text-cyan-300">
                        <strong>Impact:</strong> Trust signals can increase conversions by 42%
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-6 h-6 text-cyan-400" />
                      <CardTitle className="text-white">Page Structure</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-slate-300">
                      Layout and hierarchy impact conversions:
                    </p>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        Missing clear headline
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        Weak value proposition
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        Cluttered layout
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        Poor visual hierarchy
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        Too many distractions
                      </li>
                    </ul>
                    <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-lg p-3 mt-4">
                      <p className="text-xs text-cyan-300">
                        <strong>Impact:</strong> Clear structure can increase conversions by 30%
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Smartphone className="w-6 h-6 text-cyan-400" />
                      <CardTitle className="text-white">Mobile Readiness</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-slate-300">
                      Most traffic is mobile. We check for:
                    </p>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        Missing viewport meta tag
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        Fixed widths in CSS
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        Small font sizes
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        No touch-friendly inputs
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        Tables used for layout
                      </li>
                    </ul>
                    <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-lg p-3 mt-4">
                      <p className="text-xs text-cyan-300">
                        <strong>Impact:</strong> Mobile-friendly sites convert 2-3x better
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Target className="w-6 h-6 text-cyan-400" />
                      <CardTitle className="text-white">CTA Quality</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-slate-300">
                      Your call-to-action drives conversions. We check:
                    </p>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        Unclear button text
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        Poor contrast and visibility
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        Multiple competing CTAs
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        CTA below the fold
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        No sense of urgency
                      </li>
                    </ul>
                    <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-lg p-3 mt-4">
                      <p className="text-xs text-cyan-300">
                        <strong>Impact:</strong> Better CTAs can increase clicks by 90%
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Users className="w-6 h-6 text-cyan-400" />
                      <CardTitle className="text-white">User Experience</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-slate-300">
                      Overall UX friction points:
                    </p>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        Confusing navigation
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        Intrusive popups
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        Distracting animations
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        Unclear value proposition
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        Information overload
                      </li>
                    </ul>
                    <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-lg p-3 mt-4">
                      <p className="text-xs text-cyan-300">
                        <strong>Impact:</strong> Good UX can double conversion rates
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-cyan-400" />
                </div>
                <h2 className="text-3xl font-bold">How to Interpret Friction Scores</h2>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-400/20 rounded-lg p-8 mb-8">
                <p className="text-slate-300 mb-6">
                  Dravikly rates your page on a scale from <strong>0-100</strong>, where lower scores indicate less friction. Here's how to understand your score:
                </p>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-24 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-white">0-20</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-green-400 mb-2">Excellent</h3>
                      <p className="text-slate-300">
                        Your page has minimal friction. Users can convert smoothly with very few obstacles. Keep monitoring and making incremental improvements.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-24 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-white">21-40</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-cyan-400 mb-2">Good</h3>
                      <p className="text-slate-300">
                        Your page performs well but has some minor friction points. Address the high-priority issues to optimize further.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-24 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-white">41-60</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-yellow-400 mb-2">Needs Work</h3>
                      <p className="text-slate-300">
                        Your page has moderate friction that's likely hurting conversions. Focus on the critical issues identified in your report.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-24 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-white">61-80</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-orange-400 mb-2">Poor</h3>
                      <p className="text-slate-300">
                        Your page has significant friction issues. Many users are likely abandoning before converting. Prioritize fixes immediately.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-24 h-16 bg-gradient-to-r from-red-500 to-red-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-white">81-100</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-red-400 mb-2">Critical</h3>
                      <p className="text-slate-300">
                        Your page has severe friction problems. Most users are likely abandoning. This requires immediate attention and a comprehensive redesign.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="w-6 h-6 mr-2 text-cyan-400" />
                    Scoring Methodology
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-300">
                  <p className="mb-4">
                    Our AI analyzes your page against best practices and industry benchmarks. Each friction point is weighted by:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">•</span>
                      <strong>Severity:</strong> How much it impacts conversions
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">•</span>
                      <strong>Frequency:</strong> How many users are affected
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">•</span>
                      <strong>Fix Difficulty:</strong> How hard it is to resolve
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                </div>
                <h2 className="text-3xl font-bold">Best Practices for Form Optimization</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20">
                  <CardHeader>
                    <CardTitle className="text-white">Do's</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-slate-300">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Keep forms short</strong> - Only ask for essential information
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Use clear labels</strong> - Above or inside input fields, never beside
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Enable autofill</strong> - Use proper input types and autocomplete attributes
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Show progress</strong> - Multi-step forms need clear progress indicators
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Inline validation</strong> - Show errors immediately, not on submit
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Mobile-first design</strong> - Large tap targets, proper keyboard types
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Clear CTAs</strong> - Action-oriented button text like "Get Started"
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Add trust signals</strong> - Security badges, privacy assurances
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 backdrop-blur-sm border-red-400/20">
                  <CardHeader>
                    <CardTitle className="text-white">Don'ts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-slate-300">
                      <li className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Don't ask for too much</strong> - Every field reduces conversions by 11%
                        </div>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Don't use unclear placeholders</strong> - They disappear when typing
                        </div>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Don't hide required fields</strong> - Mark them clearly upfront
                        </div>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Don't use CAPTCHAs</strong> - They reduce conversions by 30%+
                        </div>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Don't reset on errors</strong> - Preserve user input when showing errors
                        </div>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Don't use generic buttons</strong> - "Submit" is less effective than specific text
                        </div>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Don't make passwords difficult</strong> - Show/hide toggle is essential
                        </div>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Don't use dropdowns unnecessarily</strong> - Radio buttons or buttons work better
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-cyan-400" />
                </div>
                <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
              </div>

              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="bg-slate-800/50 backdrop-blur-sm border border-cyan-400/20 rounded-lg px-6">
                  <AccordionTrigger className="text-white hover:text-cyan-400">
                    How accurate is the AI analysis?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-300">
                    Our AI is trained on millions of conversion optimization case studies and uses state-of-the-art language models (GPT-5, Claude 4.5). While no automated tool is 100% accurate, our analysis typically identifies 80-90% of major friction points. We recommend combining AI insights with user testing for best results.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="bg-slate-800/50 backdrop-blur-sm border border-cyan-400/20 rounded-lg px-6">
                  <AccordionTrigger className="text-white hover:text-cyan-400">
                    How long does an analysis take?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-300">
                    Most analyses complete in 30-60 seconds. Complex pages with many forms or elements may take up to 2 minutes. PRO and ULTRA subscribers get priority processing for faster results.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="bg-slate-800/50 backdrop-blur-sm border border-cyan-400/20 rounded-lg px-6">
                  <AccordionTrigger className="text-white hover:text-cyan-400">
                    Can I analyze password-protected pages?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-300">
                    Currently, FrictionKiller can only analyze publicly accessible URLs. For password-protected pages, we recommend creating a staging environment with temporary public access, or upgrading to ULTRA for API access where you can submit HTML directly.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="bg-slate-800/50 backdrop-blur-sm border border-cyan-400/20 rounded-lg px-6">
                  <AccordionTrigger className="text-white hover:text-cyan-400">
                    What's the difference between friction score and conversion rate?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-300">
                    Friction score measures usability obstacles on your page (0-100 scale), while conversion rate is the percentage of visitors who complete your desired action. Lower friction typically leads to higher conversion rates, but other factors like traffic quality, value proposition, and pricing also matter.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="bg-slate-800/50 backdrop-blur-sm border border-cyan-400/20 rounded-lg px-6">
                  <AccordionTrigger className="text-white hover:text-cyan-400">
                    Can I share reports with my team?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-300">
                    Yes! PRO and ULTRA subscribers can export reports as PDFs to share with stakeholders. Free users can share analysis URLs, but recipients will need to sign up for a free account to view the full report.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6" className="bg-slate-800/50 backdrop-blur-sm border border-cyan-400/20 rounded-lg px-6">
                  <AccordionTrigger className="text-white hover:text-cyan-400">
                    Do you store or use my analyzed pages?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-300">
                    We store the URL and analysis results for your dashboard history, but we do NOT store full page content or HTML. Analysis is performed in real-time and not retained. We never share your data with third parties or use it for training purposes.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7" className="bg-slate-800/50 backdrop-blur-sm border border-cyan-400/20 rounded-lg px-6">
                  <AccordionTrigger className="text-white hover:text-cyan-400">
                    Can I analyze competitor websites?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-300">
                    Yes! You can analyze any publicly accessible URL, including competitor sites. ULTRA subscribers get competitive benchmarking features that compare your scores against industry averages and competitors.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8" className="bg-slate-800/50 backdrop-blur-sm border border-cyan-400/20 rounded-lg px-6">
                  <AccordionTrigger className="text-white hover:text-cyan-400">
                    What if I disagree with the AI's recommendations?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-300">
                    AI recommendations are suggestions based on best practices and statistical data. Your specific audience and business context may differ. We recommend A/B testing changes before full implementation. Use your judgment and domain expertise alongside AI insights.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-9" className="bg-slate-800/50 backdrop-blur-sm border border-cyan-400/20 rounded-lg px-6">
                  <AccordionTrigger className="text-white hover:text-cyan-400">
                    How often should I re-analyze my pages?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-300">
                    We recommend analyzing after any significant design changes or at least quarterly. Set up a regular review schedule: monthly for high-traffic conversion pages, quarterly for secondary pages. Track your friction score over time to measure improvement.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-10" className="bg-slate-800/50 backdrop-blur-sm border border-cyan-400/20 rounded-lg px-6">
                  <AccordionTrigger className="text-white hover:text-cyan-400">
                    Do you offer implementation services?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-300">
                    While we don't directly implement fixes, ULTRA subscribers get access to our partner network of conversion rate optimization (CRO) experts who can help execute recommendations. Contact support@frictionkiller.com for details.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <section className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-400/30 rounded-2xl p-12 text-center">
              <h2 className="text-4xl font-bold mb-4">Ready to Eliminate Friction?</h2>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Join thousands of businesses using FrictionKiller to optimize their conversion funnels and boost revenue
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10">
                    View Pricing
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-slate-400 mt-6">
                No credit card required • 5 free analyses to start • Upgrade anytime
              </p>
            </section>
          </div>
        </main>

        <footer className="border-t border-cyan-400/20 bg-slate-800/50 backdrop-blur-sm mt-16">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-3">
                <Logo className="w-6 h-6" />
                <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Dravikly
                </span>
              </div>
              <div className="flex space-x-6 text-sm text-slate-400">
                <Link href="/pricing" className="hover:text-cyan-400 transition-colors">
                  Pricing
                </Link>
                <Link href="/guide" className="hover:text-cyan-400 transition-colors">
                  Guide
                </Link>
                <a href="mailto:support@frictionkiller.com" className="hover:text-cyan-400 transition-colors">
                  Support
                </a>
              </div>
              <p className="text-sm text-slate-400">
                © 2025 Dravikly. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
