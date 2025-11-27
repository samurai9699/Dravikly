'use client';

import Link from 'next/link';
import { ArrowRight, Rocket, Users, Zap, Heart, Globe, TrendingUp, Code, Sparkles, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function CareersPage() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleNotifyMe = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/careers/notify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit');
            }

            setSubmitted(true);
            setEmail('');
            setTimeout(() => setSubmitted(false), 5000);
        } catch (error) {
            console.error('Error submitting email:', error);
            alert('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="career-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                            <path d="M50 0 L50 100 M0 50 L100 50" stroke="currentColor" strokeWidth="0.5" fill="none" />
                            <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="0.5" fill="none" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#career-pattern)" />
                </svg>
            </div>

            {/* Navigation */}
            <nav className="relative z-10 container mx-auto px-6 py-6">
                <div className="flex justify-between items-center">
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="relative">
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:scale-110">
                                <defs>
                                    <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#06b6d4" />
                                        <stop offset="100%" stopColor="#3b82f6" />
                                    </linearGradient>
                                </defs>
                                <circle cx="20" cy="20" r="18" stroke="url(#logo-gradient)" strokeWidth="2" fill="none" opacity="0.3" />
                                <path d="M 12 20 Q 16 12, 20 20 T 28 20" stroke="url(#logo-gradient)" strokeWidth="2.5" fill="none" strokeLinecap="round" className="animate-pulse" />
                                <circle cx="12" cy="20" r="2.5" fill="url(#logo-gradient)" />
                                <circle cx="20" cy="20" r="2.5" fill="url(#logo-gradient)" />
                                <circle cx="28" cy="20" r="2.5" fill="url(#logo-gradient)" />
                                <path d="M 20 28 L 20 16 M 16 20 L 20 16 L 24 20" stroke="url(#logo-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            Dravikly
                        </span>
                    </Link>
                    <Link href="/">
                        <Button variant="ghost" className="text-white hover:text-cyan-400">
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 container mx-auto px-6 py-20">
                <div className="max-w-5xl mx-auto">
                    {/* Floating Elements */}
                    <div className="absolute top-20 left-10 w-20 h-20 bg-cyan-400/10 rounded-full blur-xl animate-float" />
                    <div className="absolute top-40 right-20 w-32 h-32 bg-blue-400/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />

                    <div className="text-center space-y-8 mb-20">
                        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-800/50 border border-cyan-400/30 rounded-full">
                            <Rocket className="w-4 h-4 text-cyan-400" />
                            <span className="text-sm text-cyan-400">Join Our Mission</span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                            Build the future of{' '}
                            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                                conversion intelligence
                            </span>
                        </h1>

                        <p className="text-xl sm:text-2xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
                            We're on a mission to help every founder eliminate friction and convert more customers.
                            Join us in building AI-powered tools that make a real impact.
                        </p>
                    </div>

                    {/* Values Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mb-20">
                        {[
                            {
                                icon: Zap,
                                title: 'Move Fast',
                                description: 'Ship features that matter. Iterate quickly. Learn from real users.',
                                gradient: 'from-cyan-500 to-blue-500',
                            },
                            {
                                icon: Heart,
                                title: 'Customer Obsessed',
                                description: 'Every line of code should help founders convert better and grow faster.',
                                gradient: 'from-blue-500 to-purple-500',
                            },
                            {
                                icon: Sparkles,
                                title: 'Innovation First',
                                description: 'Push boundaries with AI. Solve problems others think are impossible.',
                                gradient: 'from-purple-500 to-pink-500',
                            },
                        ].map((value, index) => (
                            <div
                                key={index}
                                className="group bg-slate-800/30 backdrop-blur-sm border border-cyan-400/20 rounded-xl p-8 hover:border-cyan-400/50 transition-all duration-300 hover:-translate-y-2"
                            >
                                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                                    <value.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Current Status */}
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-cyan-400/30 rounded-2xl p-12 mb-20">
                        <div className="text-center space-y-6">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 mb-4">
                                <Users className="w-10 h-10 text-white" />
                            </div>

                            <h2 className="text-3xl sm:text-4xl font-bold">
                                No open positions{' '}
                                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                    right now
                                </span>
                            </h2>

                            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                                We're a lean, focused team building something special. While we don't have openings today,
                                we're always looking for exceptional talent who shares our vision.
                            </p>

                            <div className="pt-8">
                                <p className="text-lg text-slate-400 mb-6">
                                    Be the first to know when we're hiring
                                </p>

                                {!submitted ? (
                                    <form onSubmit={handleNotifyMe} className="max-w-md mx-auto">
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="your@email.com"
                                                required
                                                className="flex-1 px-6 py-4 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                                            />
                                            <Button
                                                type="submit"
                                                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-4 whitespace-nowrap"
                                            >
                                                <Mail className="w-5 h-5 mr-2" />
                                                Notify Me
                                            </Button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="max-w-md mx-auto p-6 bg-green-500/10 border border-green-500/30 rounded-lg">
                                        <p className="text-green-400 font-semibold flex items-center justify-center">
                                            <Sparkles className="w-5 h-5 mr-2" />
                                            Thanks! Check your email for confirmation.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* What We're Building */}
                    <div className="mb-20">
                        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
                            What we're{' '}
                            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                building
                            </span>
                        </h2>

                        <div className="grid md:grid-cols-2 gap-8">
                            {[
                                {
                                    icon: Code,
                                    title: 'AI-Powered Analysis',
                                    description: 'Advanced machine learning models that detect friction points humans miss.',
                                },
                                {
                                    icon: TrendingUp,
                                    title: 'Real-Time Insights',
                                    description: 'Instant feedback on conversion optimization opportunities.',
                                },
                                {
                                    icon: Globe,
                                    title: 'Scale & Performance',
                                    description: 'Infrastructure that handles millions of analyses without breaking a sweat.',
                                },
                                {
                                    icon: Sparkles,
                                    title: 'Delightful UX',
                                    description: 'Beautiful interfaces that make complex data simple and actionable.',
                                },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-start space-x-4 p-6 bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl hover:border-cyan-400/30 transition-all"
                                >
                                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                                        <item.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                                        <p className="text-slate-400">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="text-center space-y-6">
                        <h2 className="text-2xl sm:text-3xl font-bold">
                            Think you'd be a great fit?
                        </h2>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                            Even without open positions, we love hearing from talented people.
                            Drop us a line and tell us what you're passionate about.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Link href="/contact">
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-6 text-lg"
                                >
                                    <Mail className="w-5 h-5 mr-2" />
                                    Get in Touch
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 px-8 py-6 text-lg"
                                >
                                    Explore Dravikly
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-slate-800 mt-32">
                <div className="container mx-auto px-6 py-12">
                    <div className="text-center text-slate-400">
                        <p>&copy; {new Date().getFullYear()} Dravikly. Built with passion for founders.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
