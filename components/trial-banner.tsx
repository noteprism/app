import { useState, useEffect } from 'react';
import { differenceInDays, format } from 'date-fns';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface TrialBannerProps {
  trialEndsAt: string | null;
  trialEndingSoon: boolean;
  plan: string | null;
  onManageSubscription: () => void;
}

export function TrialBanner({ trialEndsAt, trialEndingSoon, plan, onManageSubscription }: TrialBannerProps) {
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  
  useEffect(() => {
    if (trialEndsAt) {
      const endDate = new Date(trialEndsAt);
      const days = differenceInDays(endDate, new Date());
      setDaysRemaining(Math.max(0, days));
    }
  }, [trialEndsAt]);
  
  // Don't show banner for paid users
  if (plan === 'paid') return null;
  
  // Trial is active
  if (plan === 'trial' && daysRemaining !== null && daysRemaining > 0 && trialEndsAt) {
    return (
      <Alert className={trialEndingSoon ? 'bg-transparent border-amber-500' : 'bg-transparent border-[#232425]'}>
        <AlertCircle className={trialEndingSoon ? 'text-amber-500' : 'text-blue-400'} />
        <AlertTitle className="font-medium text-foreground">
          {trialEndingSoon ? 'Your trial is ending soon!' : 'Trial Active'}
        </AlertTitle>
        <AlertDescription className="flex items-center justify-between text-foreground">
          <span>
            {trialEndingSoon
              ? `Your trial ends in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}. Subscribe now to continue using Noteprism Pro features.`
              : `You have ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} left in your trial (ends ${format(new Date(trialEndsAt), 'MMM d, yyyy')}).`}
          </span>
          <Button 
            variant={trialEndingSoon ? "default" : "outline"} 
            size="sm" 
            onClick={onManageSubscription}
          >
            {trialEndingSoon ? 'Subscribe Now' : 'Upgrade Now'}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  
  // Trial has ended or user is on free plan
  if (plan === 'free') {
    return (
      <Alert className="bg-transparent border-[#232425]">
        <AlertCircle className="text-red-500" />
        <AlertTitle className="font-medium text-foreground">Free Plan</AlertTitle>
        <AlertDescription className="flex items-center justify-between text-foreground">
          <span>Subscribe to Noteprism Pro to unlock all features.</span>
          <Button variant="default" size="sm" onClick={onManageSubscription}>
            Subscribe Now
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
} 