'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ArrowRight, Zap, TrendingUp, Crown, Loader2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { toast } from 'sonner';
import { trackEvent } from '@/lib/track-event';
import { createClient } from '@/lib/supabase/client';
import { Logo } from '@/components/Logo';
import { PRICING_TIERS, TierName } from '@/lib/paddle-config';

// Declare Paddle global type
declare global {
  interface Window {
    Paddle?: any;
  }
}

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [currentTier, setCurrentTier] = useState<TierName>('free');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadUserTier = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('tier')
        .eq('user_id', user.id)
        .maybeSingle();

      if (subscription) {
        setCurrentTier((subscription.tier?.toLowerCase() || 'free') as TierName);
      }
    };

    loadUserTier();
  }, [supabase]);

  const handleCheckout = async (tier: TierName) => {
    setCheckoutLoading(tier);

    try {
      // Check if user is logged in first
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error('Please log in to upgrade your plan');
        router.push('/login');
        setCheckoutLoading(null);
        return;
      }

      await trackEvent('upgrade_clicked', {
        from_tier: currentTier,
        to_tier: tier.toUpperCase(),
      });

      // Get the price ID for this tier
      const priceId = isAnnual
        ? PRICING_TIERS[tier].paddleAnnualPriceId
        : PRICING_TIERS[tier].paddleMonthlyPriceId;

      if (!priceId) {
        throw new Error('Price ID not configured for this plan');
      }

      // Initialize Paddle
      if (!window.Paddle) {
        await loadPaddleScript();
      }

      // Open Paddle checkout with transactionId from server
      const response = await fetch('/api/paddle/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: tier,
          billingCycle: isAnnual ? 'annual' : 'monthly',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout');
      }

      // Open overlay with transaction ID
      if (data.transactionId) {
        window.Paddle.Checkout.open({
          transactionId: data.transactionId,
        });
      } else {
        // Fallback to URL if no transaction ID
        window.location.href = data.url;
      }

      setCheckoutLoading(null);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to start checkout');
      setCheckoutLoading(null);
    }
  };

  // Load Paddle.js script
  const loadPaddleScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.Paddle) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
      script.async = true;

      script.onload = () => {
        if (window.Paddle) {
          const environment = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === 'production'
            ? 'production'
            : 'sandbox';

          window.Paddle.Environment.set(environment);
          window.Paddle.Initialize({
            token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || '',
          });

          resolve();
        } else {
          reject(new Error('Paddle failed to load'));
        }
      };

      script.onerror = () => reject(new Error('Failed to load Paddle script'));

      document.head.appendChild(script);
    });
  };

  const tiers = [
    {
      ...PRICING_TIERS.free,
      icon: Shield,
      price: 0,
      period: 'forever',
      cta: 'Start Free',
      ctaLink: '/signup',
      gradient: 'from-slate-500 to-slate-600',
      savings: null,
    },
    {
      ...PRICING_TIERS.starter,
      icon: Zap,
      price: isAnnual ? PRICING_TIERS.starter.annualPrice : PRICING_TIERS.starter.monthlyPrice,
      period: 'month',
      cta: 'Get Started',
      ctaLink: '/checkout/starter',
      gradient: 'from-blue-500 to-cyan-500',
      savings: isAnnual ? `Save $${(PRICING_TIERS.starter.monthlyPrice - PRICING_TIERS.starter.annualPrice) * 12}/year` : null,
    },
    {
      ...PRICING_TIERS.pro,
      icon: Zap,
      price: isAnnual ? PRICING_TIERS.pro.annualPrice : PRICING_TIERS.pro.monthlyPrice,
      period: 'month',
      cta: 'Upgrade to Pro',
      ctaLink: '/checkout/pro',
      gradient: 'from-cyan-500 to-blue-500',
      savings: isAnnual ? `Save $${(PRICING_TIERS.pro.monthlyPrice - PRICING_TIERS.pro.annualPrice) * 12}/year` : null,
    },
    {
      ...PRICING_TIERS.enterprise,
      icon: Crown,
      price: isAnnual ? PRICING_TIERS.enterprise.annualPrice : PRICING_TIERS.enterprise.monthlyPrice,
      period: 'month',
      cta: 'Go Enterprise',
      ctaLink: '/checkout/enterprise',
      gradient: 'from-purple-500 to-pink-500',
      savings: isAnnual ? `Save $${(PRICING_TIERS.enterprise.monthlyPrice - PRICING_TIERS.enterprise.annualPrice) * 12}/year` : null,
    },
  ];

  const faqs = [
    {
      question: 'What counts as an analysis?',
      answer: 'Each time you submit a URL for friction analysis, it counts as one analysis. You can analyze different pages or re-analyze the same page to track improvements.',
    },
    {
      question: 'Can I upgrade or downgrade my plan?',
      answer: 'Yes! You can change your plan at any time. Upgrades take effect immediately, and downgrades take effect at the start of your next billing cycle.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover) through our secure payment processor, Stripe.',
    },
    {
      question: 'Is there a free trial for paid plans?',
      answer: 'Yes! Pro and Ultra plans come with a 7-day free trial. No credit card required to start your free account.',
    },
    {
      question: 'What happens to my data if I downgrade?',
      answer: "Your historical data is preserved. However, you'll only be able to access the amount of history included in your new plan (e.g., last 5 analyses on Free plan).",
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee on all paid plans. If you\'re not satisfied, contact us for a full refund within 30 days of purchase.',
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Absolutely! There are no long-term contracts. You can cancel your subscription at any time from your account settings.',
    },
    {
      question: 'What is priority processing?',
      answer: 'Ultra plan subscribers get their analyses processed in a dedicated queue, ensuring faster results even during peak usage times.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
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

      <nav className="relative z-10 container mx-auto px-4 sm:px-6 py-6">
        <div className="flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer group">
              <Logo className="w-6 sm:w-8 h-6 sm:h-8 transition-transform group-hover:scale-110" />
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Dravikly
              </span>
            </div>
          </Link>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:text-cyan-400 text-sm sm:text-base">
                Sign In
              </Button>
            </Link>
            <Link href="/signup" className="hidden sm:block">
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <section className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Choose Your{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Conversion Power
              </span>
            </h1>
            <p className="text-base sm:text-xl text-slate-300 mb-8">
              Simple, transparent pricing. Scale as you grow.
            </p>

            <div className="flex items-center justify-center space-x-4 mb-4">
              <span className={`text-lg ${!isAnnual ? 'text-white font-semibold' : 'text-slate-400'}`}>
                Monthly
              </span>
              <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
                className="data-[state=checked]:bg-cyan-500"
              />
              <span className={`text-lg ${isAnnual ? 'text-white font-semibold' : 'text-slate-400'}`}>
                Annual
              </span>
            </div>
            {isAnnual && (
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-cyan-500/20 border border-cyan-400/50 rounded-full">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-cyan-400 font-semibold">Save 20% with annual billing</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
            {tiers.map((tier, index) => (
              <div
                key={index}
                className={`relative group ${tier.highlighted ? 'md:scale-105 z-10' : ''
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
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${tier.gradient} mb-4`}>
                      <tier.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                    <p className="text-slate-400 text-sm mb-4">{tier.description}</p>
                    <div className="flex items-baseline mb-2">
                      <span className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        ${tier.price}
                      </span>
                      <span className="text-slate-400 ml-2">/{tier.period}</span>
                    </div>
                    {tier.savings && (
                      <div className="text-sm text-green-400 font-semibold">
                        {tier.savings}
                      </div>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {tier.id === 'free' ? (
                    <Link href={tier.ctaLink} className="block">
                      <Button
                        className="w-full group/btn bg-slate-700 hover:bg-slate-600 text-white"
                        size="lg"
                      >
                        {tier.cta}
                        <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      onClick={() => handleCheckout(tier.id)}
                      disabled={checkoutLoading !== null}
                      className={`w-full group/btn ${tier.highlighted
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                        }`}
                      size="lg"
                    >
                      {checkoutLoading === tier.id ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          {tier.cta}
                          <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-slate-800/30 backdrop-blur-sm border border-cyan-400/20 rounded-xl px-6 hover:border-cyan-400/40 transition-colors"
                >
                  <AccordionTrigger className="text-left text-lg font-semibold hover:text-cyan-400 py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-300 pb-6 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="max-w-4xl mx-auto mt-20 text-center">
            <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-400/30 rounded-2xl p-12">
              <h2 className="text-4xl font-bold mb-6">
                Still have questions?
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Our team is here to help you choose the perfect plan
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10"
                  >
                    Contact Sales
                  </Button>
                </Link>
                <Link href="/signup" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
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
