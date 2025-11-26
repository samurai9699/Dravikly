'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
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
                <h1 className="text-5xl font-bold mb-4">Terms of Service</h1>
                <p className="text-slate-400 mb-12">Last updated: November 26, 2025</p>

                <div className="space-y-8 text-slate-300">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Agreement to Terms</h2>
                        <p className="leading-relaxed">
                            By accessing or using Dravikly, you agree to be bound by these Terms of Service.
                            If you disagree with any part of these terms, you may not access the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Use of Service</h2>
                        <div className="space-y-4">
                            <p className="leading-relaxed">
                                Dravikly provides AI-powered conversion optimization analysis. You may use our service to:
                            </p>
                            <ul className="list-disc list-inside space-y-2 leading-relaxed">
                                <li>Analyze websites and landing pages for conversion friction</li>
                                <li>Receive AI-generated insights and recommendations</li>
                                <li>Export reports and analysis results</li>
                                <li>Access our API (on applicable plans)</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Account Responsibilities</h2>
                        <p className="leading-relaxed mb-4">You are responsible for:</p>
                        <ul className="list-disc list-inside space-y-2 leading-relaxed">
                            <li>Maintaining the security of your account credentials</li>
                            <li>All activities that occur under your account</li>
                            <li>Ensuring your use complies with applicable laws</li>
                            <li>The accuracy of information you provide</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Prohibited Uses</h2>
                        <p className="leading-relaxed mb-4">You may not:</p>
                        <ul className="list-disc list-inside space-y-2 leading-relaxed">
                            <li>Use the service for any illegal purpose</li>
                            <li>Attempt to gain unauthorized access to our systems</li>
                            <li>Reverse engineer or copy our AI models</li>
                            <li>Resell or redistribute our service without permission</li>
                            <li>Use the service to analyze websites you don't have permission to analyze</li>
                            <li>Abuse or overload our systems</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Subscription and Billing</h2>
                        <div className="space-y-4">
                            <p className="leading-relaxed">
                                Paid subscriptions are billed monthly or annually based on your selected plan.
                                You can cancel your subscription at any time, and you'll retain access until the end of your billing period.
                            </p>
                            <p className="leading-relaxed">
                                We reserve the right to change our pricing with 30 days notice. Price changes will not affect
                                your current billing cycle.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Refund Policy</h2>
                        <p className="leading-relaxed">
                            We offer a 30-day money-back guarantee. If you're not satisfied with our service within the first
                            30 days, contact us for a full refund. After 30 days, refunds are provided at our discretion.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Intellectual Property</h2>
                        <p className="leading-relaxed">
                            The service, including all content, features, and functionality, is owned by Dravikly and protected
                            by copyright, trademark, and other intellectual property laws. You retain ownership of any data you
                            input into our service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
                        <p className="leading-relaxed">
                            Dravikly provides analysis and recommendations, but we cannot guarantee specific conversion improvements.
                            We are not liable for any indirect, incidental, or consequential damages arising from your use of the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Service Availability</h2>
                        <p className="leading-relaxed">
                            We strive for 99.9% uptime but do not guarantee uninterrupted access. We may perform maintenance,
                            updates, or modifications that temporarily affect service availability.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Termination</h2>
                        <p className="leading-relaxed">
                            We reserve the right to suspend or terminate your account if you violate these terms or engage in
                            fraudulent or abusive behavior. You may terminate your account at any time through your account settings.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Changes to Terms</h2>
                        <p className="leading-relaxed">
                            We may modify these terms at any time. We will notify you of significant changes via email or through
                            the service. Continued use after changes constitutes acceptance of the new terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Contact</h2>
                        <p className="leading-relaxed">
                            Questions about these Terms? Contact us at{' '}
                            <a href="mailto:legal@dravikly.com" className="text-cyan-400 hover:text-cyan-300">
                                legal@dravikly.com
                            </a>
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
