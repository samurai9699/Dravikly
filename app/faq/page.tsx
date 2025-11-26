'use client';

import Link from 'next/link';
import { ArrowLeft, HelpCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function FAQPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
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
            answer: 'Free gives you 5 analyses total. Starter offers 60/month with PDF exports. Pro provides 300/month with API access and priority processing. Enterprise offers unlimited analyses, white-label reports, and team seats for agencies.',
        },
        {
            question: 'How do I cancel my subscription?',
            answer: 'You can cancel anytime from your account settings. Your access continues until the end of your billing period, and you won\'t be charged again.',
        },
        {
            question: 'Do you offer refunds?',
            answer: 'Yes! We offer a 30-day money-back guarantee. If you\'re not satisfied with our service within the first 30 days, contact us for a full refund.',
        },
        {
            question: 'What types of pages can I analyze?',
            answer: 'You can analyze any public webpage including landing pages, checkout flows, signup forms, lead generation pages, and more. Our AI works best with pages that have forms or conversion goals.',
        },
        {
            question: 'Is my data secure?',
            answer: 'Absolutely. We use industry-standard encryption and security practices. We never share your data with third parties, and you can delete your account and data at any time.',
        },
    ];

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
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-6">
                        Frequently Asked{' '}
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            Questions
                        </span>
                    </h1>
                    <p className="text-xl text-slate-400">
                        Everything you need to know about Dravikly
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
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
                                    className={`w-5 h-5 text-cyan-400 transition-transform duration-200 flex-shrink-0 ${openFaq === index ? 'transform rotate-180' : ''
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

                <div className="mt-16 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 rounded-xl p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
                    <p className="text-slate-300 mb-6">
                        Can't find the answer you're looking for? Our support team is here to help.
                    </p>
                    <Link href="/contact">
                        <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
                            Contact Support
                        </Button>
                    </Link>
                </div>
            </main>
        </div>
    );
}
