'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
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
                <h1 className="text-5xl font-bold mb-4">Privacy Policy</h1>
                <p className="text-slate-400 mb-12">Last updated: November 26, 2025</p>

                <div className="space-y-8 text-slate-300">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
                        <p className="leading-relaxed">
                            At Dravikly, we take your privacy seriously. This Privacy Policy explains how we collect, use,
                            disclose, and safeguard your information when you use our service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-semibold text-cyan-400 mb-2">Account Information</h3>
                                <p className="leading-relaxed">
                                    When you create an account, we collect your name, email address, and password.
                                    This information is necessary to provide you with access to our services.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-cyan-400 mb-2">Usage Data</h3>
                                <p className="leading-relaxed">
                                    We collect information about how you interact with our service, including the URLs you analyze,
                                    analysis results, and feature usage. This helps us improve our AI models and service quality.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-cyan-400 mb-2">Payment Information</h3>
                                <p className="leading-relaxed">
                                    Payment processing is handled by secure third-party providers. We do not store your full credit card details.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
                        <ul className="list-disc list-inside space-y-2 leading-relaxed">
                            <li>To provide and maintain our service</li>
                            <li>To improve and optimize our AI analysis capabilities</li>
                            <li>To communicate with you about your account and our services</li>
                            <li>To detect and prevent fraud or abuse</li>
                            <li>To comply with legal obligations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
                        <p className="leading-relaxed">
                            We implement industry-standard security measures to protect your data, including encryption,
                            secure servers, and regular security audits. However, no method of transmission over the internet
                            is 100% secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Data Retention</h2>
                        <p className="leading-relaxed">
                            We retain your personal information for as long as your account is active or as needed to provide
                            you services. You can request deletion of your account and data at any time by contacting us.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
                        <p className="leading-relaxed mb-4">You have the right to:</p>
                        <ul className="list-disc list-inside space-y-2 leading-relaxed">
                            <li>Access your personal data</li>
                            <li>Correct inaccurate data</li>
                            <li>Request deletion of your data</li>
                            <li>Export your data</li>
                            <li>Opt-out of marketing communications</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Cookies</h2>
                        <p className="leading-relaxed">
                            We use cookies and similar tracking technologies to improve your experience, analyze usage,
                            and assist in our marketing efforts. You can control cookies through your browser settings.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Changes to This Policy</h2>
                        <p className="leading-relaxed">
                            We may update this Privacy Policy from time to time. We will notify you of any changes by
                            posting the new policy on this page and updating the "Last updated" date.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
                        <p className="leading-relaxed">
                            If you have questions about this Privacy Policy, please contact us at{' '}
                            <a href="mailto:privacy@dravikly.com" className="text-cyan-400 hover:text-cyan-300">
                                privacy@dravikly.com
                            </a>
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
