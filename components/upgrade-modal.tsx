'use client';

import { useRouter } from 'next/navigation';
import { AlertCircle, Crown, Zap, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature: string;
  requiredTier: 'PRO' | 'ULTRA';
  description: string;
}

export function UpgradeModal({
  open,
  onOpenChange,
  feature,
  requiredTier,
  description,
}: UpgradeModalProps) {
  const router = useRouter();

  const handleUpgrade = () => {
    onOpenChange(false);
    router.push('/pricing');
  };

  const tierConfig = {
    PRO: {
      icon: Zap,
      color: 'from-cyan-500 to-blue-500',
      borderColor: 'border-cyan-400/50',
      bgColor: 'bg-cyan-500/10',
      textColor: 'text-cyan-400',
    },
    ULTRA: {
      icon: Crown,
      color: 'from-purple-500 to-pink-500',
      borderColor: 'border-purple-400/50',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-400',
    },
  };

  const config = tierConfig[requiredTier];
  const TierIcon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div
              className={`p-4 rounded-2xl bg-gradient-to-br ${config.color} bg-opacity-20`}
            >
              <TierIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-bold">
            Upgrade to {requiredTier}
          </DialogTitle>
          <DialogDescription className="text-center text-slate-400 pt-2">
            Unlock this premium feature and supercharge your conversion optimization
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div
            className={`flex items-start space-x-3 p-4 rounded-lg border ${config.borderColor} ${config.bgColor}`}
          >
            <AlertCircle className={`w-5 h-5 mt-0.5 ${config.textColor} flex-shrink-0`} />
            <div>
              <h4 className="font-semibold text-white mb-1">{feature}</h4>
              <p className="text-sm text-slate-300">{description}</p>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className={`w-4 h-4 ${config.textColor}`} />
              <h4 className="font-semibold text-white">
                What you get with {requiredTier}:
              </h4>
            </div>
            <ul className="space-y-2 text-sm text-slate-300">
              {requiredTier === 'PRO' ? (
                <>
                  <li className="flex items-start space-x-2">
                    <span className={`mt-1 ${config.textColor}`}>•</span>
                    <span>20 analyses per day</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className={`mt-1 ${config.textColor}`}>•</span>
                    <span>Deep insights & recommendations</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className={`mt-1 ${config.textColor}`}>•</span>
                    <span>Full history access</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className={`mt-1 ${config.textColor}`}>•</span>
                    <span>PDF export for reports</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className={`mt-1 ${config.textColor}`}>•</span>
                    <span>Priority email support</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start space-x-2">
                    <span className={`mt-1 ${config.textColor}`}>•</span>
                    <span>Unlimited analyses</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className={`mt-1 ${config.textColor}`}>•</span>
                    <span>Priority processing queue</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className={`mt-1 ${config.textColor}`}>•</span>
                    <span>Competitive benchmarking</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className={`mt-1 ${config.textColor}`}>•</span>
                    <span>API access</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className={`mt-1 ${config.textColor}`}>•</span>
                    <span>White-label reports</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className={`mt-1 ${config.textColor}`}>•</span>
                    <span>Priority support</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            Maybe Later
          </Button>
          <Button
            onClick={handleUpgrade}
            className={`w-full sm:w-auto bg-gradient-to-r ${config.color} hover:opacity-90 text-white font-semibold`}
          >
            Upgrade to {requiredTier}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
