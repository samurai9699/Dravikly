'use client';

import Link from 'next/link';
import { ArrowLeft, Target, Zap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
            <nav className="container mx-auto px-6 py-6">
                <Link href="/">
                    <Button variant="ghost" className="text-slate-400 hover:text-cyan-400">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Button>
                </Link>
            </nav>

            <main className="container mx-auto px-6 py-16 max-w-4xl">
                <h1 className="text-5xl font-bold mb-6">
                    About{' '}
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        Dravikly
                    </span>
                </h1>

                <div className="space-y-8 text-lg text-slate-300 leading-relaxed">
                    <p>
                        Dravikly was built by founders who were tired of watching potential customers slip away at the last moment.
                        We know the frustration of having traffic but not conversions, of A/B testing endlessly without clear answers.
                    </p>

                    <p>
                        Traditional conversion rate optimization is slow, expensive, and often based on guesswork.
                        We built Dravikly to change that—using AI to instantly identify the friction points that kill conversions,
                        so you can fix them fast and get back to growing your business.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8 my-16">
                        <div className="bg-slate-800/50 border border-cyan-400/20 rounded-xl p-6">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-4">
                                <Target className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Our Mission</h3>
                            <p className="text-slate-400 text-base">
                                Make world-class conversion optimization accessible to every founder, not just those with big budgets.
                            </p>
                        </div>

                        <div className="bg-slate-800/50 border border-cyan-400/20 rounded-xl p-6">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Our Approach</h3>
                            <p className="text-slate-400 text-base">
                                AI-powered analysis that delivers actionable insights in seconds, not weeks of manual testing.
                            </p>
                        </div>

                        <div className="bg-slate-800/50 border border-cyan-400/20 rounded-xl p-6">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Our Community</h3>
                            <p className="text-slate-400 text-base">
                                500+ founders trust Dravikly to optimize their funnels and boost their bottom line.
                            </p>
                        </div>
                    </div>

                    <p>
                        We're a small, focused team obsessed with helping you convert more visitors into customers.
                        Every feature we build is designed to save you time and make you money.
                    </p>

                    <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 rounded-xl p-8 mt-12">
                        <h2 className="text-2xl font-bold mb-4">Ready to eliminate friction?</h2>
                        <p className="text-slate-300 mb-6">
                            Join hundreds of founders who have already optimized their conversion funnels with Dravikly.
                        </p>
                        <Link href="/signup">
                            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
                                Start Your Free Analysis
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
