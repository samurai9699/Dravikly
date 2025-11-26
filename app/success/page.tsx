'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function SuccessPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Processing your subscription...');
    const supabase = createClient();

    useEffect(() => {
        const syncSubscription = async () => {
            try {
                // Get subscription ID from URL params (if Paddle passes it)
                const subscriptionId = searchParams.get('subscription_id') || searchParams.get('_ptxn');

                console.log('Success page loaded, subscription ID:', subscriptionId);

                // Wait a bit for webhooks to process
                await new Promise(resolve => setTimeout(resolve, 3000));

                // Check if user is logged in
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    setStatus('error');
                    setMessage('Please log in to view your subscription');
                    return;
                }

                // Check subscription status
                const { data: subscription, error } = await supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('user_id', user.id)
                    .maybeSingle();

                if (error) {
                    console.error('Error fetching subscription:', error);
                    setStatus('error');
                    setMessage('Error checking subscription status');
                    return;
                }

                // Check if subscription was updated (not free tier)
                if (subscription && subscription.tier !== 'free' && subscription.tier !== 'FREE') {
                    setStatus('success');
                    setMessage(`Successfully upgraded to ${subscription.tier.toUpperCase()} plan!`);
                } else if (subscriptionId) {
                    // Try manual sync if we have subscription ID
                    console.log('Attempting manual sync for subscription:', subscriptionId);

                    const syncResponse = await fetch('/api/paddle/sync-subscription', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ subscriptionId }),
                    });

                    if (syncResponse.ok) {
                        const syncData = await syncResponse.json();
                        setStatus('success');
                        setMessage(`Successfully upgraded to ${syncData.subscription.tier.toUpperCase()} plan!`);
                    } else {
                        setStatus('error');
                        setMessage('Payment processed but subscription sync pending. Please contact support if this persists.');
                    }
                } else {
                    // No subscription ID and still on free tier
                    setStatus('error');
                    setMessage('Payment processed but subscription not yet updated. Please wait a moment and refresh, or contact support.');
                }
            } catch (error) {
                console.error('Error in success page:', error);
                setStatus('error');
                setMessage('An error occurred. Please contact support if your subscription is not active.');
            }
        };

        syncSubscription();
    }, [searchParams, supabase]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-8 text-center">
                {status === 'loading' && (
                    <>
                        <div className="flex justify-center mb-6">
                            <Loader2 className="w-16 h-16 text-cyan-400 animate-spin" />
                        </div>
                        <h1 className="text-2xl font-bold mb-4">Processing Payment</h1>
                        <p className="text-slate-300">{message}</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="flex justify-center mb-6">
                            <div className="bg-green-500/20 rounded-full p-4">
                                <CheckCircle className="w-16 h-16 text-green-400" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
                        <p className="text-slate-300 mb-8">{message}</p>
                        <div className="space-y-3">
                            <Link href="/dashboard" className="block">
                                <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                                    Go to Dashboard
                                </Button>
                            </Link>
                            <Link href="/pricing" className="block">
                                <Button variant="outline" className="w-full border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10">
                                    View Plans
                                </Button>
                            </Link>
                        </div>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="flex justify-center mb-6">
                            <div className="bg-yellow-500/20 rounded-full p-4">
                                <AlertCircle className="w-16 h-16 text-yellow-400" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold mb-4">Subscription Pending</h1>
                        <p className="text-slate-300 mb-8">{message}</p>
                        <div className="space-y-3">
                            <Button
                                onClick={() => window.location.reload()}
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                            >
                                Refresh Page
                            </Button>
                            <Link href="/dashboard" className="block">
                                <Button variant="outline" className="w-full border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10">
                                    Go to Dashboard
                                </Button>
                            </Link>
                            <Link href="/contact" className="block">
                                <Button variant="ghost" className="w-full text-slate-400 hover:text-white">
                                    Contact Support
                                </Button>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-8 text-center">
                    <div className="flex justify-center mb-6">
                        <Loader2 className="w-16 h-16 text-cyan-400 animate-spin" />
                    </div>
                    <h1 className="text-2xl font-bold mb-4">Loading...</h1>
                </div>
            </div>
        }>
            <SuccessPageContent />
        </Suspense>
    );
}
