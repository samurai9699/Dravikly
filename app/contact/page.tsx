'use client';

import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare, HelpCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            setSubmitted(true);

            // Reset form
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: '',
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

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

            <main className="container mx-auto px-6 py-16 max-w-5xl">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-6">
                        Get in{' '}
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            Touch
                        </span>
                    </h1>
                    <p className="text-xl text-slate-400">
                        Have questions? We're here to help you optimize your conversions.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    <div className="bg-slate-800/50 border border-cyan-400/20 rounded-xl p-6 text-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-bold mb-2">Email Us</h3>
                        <a href="mailto:support@dravikly.com" className="text-cyan-400 hover:text-cyan-300">
                            support@dravikly.com
                        </a>
                    </div>

                    <div className="bg-slate-800/50 border border-cyan-400/20 rounded-xl p-6 text-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-bold mb-2">Live Chat</h3>
                        <p className="text-slate-400 text-sm">Available Mon-Fri, 9am-5pm EST</p>
                    </div>

                    <div className="bg-slate-800/50 border border-cyan-400/20 rounded-xl p-6 text-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                            <HelpCircle className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-bold mb-2">Help Center</h3>
                        <Link href="/faq" className="text-cyan-400 hover:text-cyan-300 text-sm">
                            Browse FAQs
                        </Link>
                    </div>
                </div>

                <div className="bg-slate-800/50 border border-cyan-400/20 rounded-xl p-8 max-w-2xl mx-auto">
                    {!submitted ? (
                        <>
                            <h2 className="text-2xl font-bold mb-6">Send us a message</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
                                        placeholder="Your name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
                                        placeholder="How can we help?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Message</label>
                                    <textarea
                                        required
                                        rows={6}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
                                        placeholder="Tell us more about your question..."
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-6 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Message'
                                    )}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-700">
                                <CheckCircle className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                Message Sent!
                            </h2>
                            <p className="text-slate-300 text-lg mb-8">
                                Thanks for reaching out. We'll get back to you within 24 hours.
                            </p>
                            <Button
                                onClick={() => setSubmitted(false)}
                                variant="outline"
                                className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10"
                            >
                                Send Another Message
                            </Button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
