'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export function SubscriptionTroubleshoot() {
    const [subscriptionId, setSubscriptionId] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const handleSync = async () => {
        if (!subscriptionId.trim()) {
            setResult({
                type: 'error',
                message: 'Please enter your subscription ID',
            });
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const response = await fetch('/api/paddle/sync-subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subscriptionId: subscriptionId.trim() }),
            });

            const data = await response.json();

            if (response.ok) {
                setResult({
                    type: 'success',
                    message: `Successfully synced! You are now on the ${data.subscription.tier.toUpperCase()} plan.`,
                });
                // Refresh page after 2 seconds
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                setResult({
                    type: 'error',
                    message: data.error || 'Failed to sync subscription. Please contact support.',
                });
            }
        } catch (error) {
            setResult({
                type: 'error',
                message: 'Network error. Please try again or contact support.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-800/30 border border-cyan-400/20 rounded-lg p-6">
            <div className="flex items-start space-x-3 mb-4">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                    <h3 className="font-semibold text-white mb-1">
                        Subscription Not Updated?
                    </h3>
                    <p className="text-sm text-slate-300">
                        If you completed payment but your subscription hasn't updated, you can manually sync it here.
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Subscription ID
                    </label>
                    <Input
                        type="text"
                        placeholder="sub_01abc123..."
                        value={subscriptionId}
                        onChange={(e) => setSubscriptionId(e.target.value)}
                        className="bg-slate-900/50 border-slate-700 text-white"
                        disabled={loading}
                    />
                    <p className="text-xs text-slate-400 mt-1">
                        Find this in your payment confirmation email or Paddle receipt
                    </p>
                </div>

                <Button
                    onClick={handleSync}
                    disabled={loading || !subscriptionId.trim()}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                            Syncing...
                        </>
                    ) : (
                        <>
                            <RefreshCw className="mr-2 w-4 h-4" />
                            Sync Subscription
                        </>
                    )}
                </Button>

                {result && (
                    <Alert
                        className={
                            result.type === 'success'
                                ? 'bg-green-500/10 border-green-500/50'
                                : 'bg-red-500/10 border-red-500/50'
                        }
                    >
                        {result.type === 'success' ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                            <AlertCircle className="w-4 h-4 text-red-400" />
                        )}
                        <AlertDescription
                            className={
                                result.type === 'success' ? 'text-green-300' : 'text-red-300'
                            }
                        >
                            {result.message}
                        </AlertDescription>
                    </Alert>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700">
                <p className="text-xs text-slate-400">
                    Still having issues?{' '}
                    <a href="/contact" className="text-cyan-400 hover:underline">
                        Contact support
                    </a>
                </p>
            </div>
        </div>
    );
}
