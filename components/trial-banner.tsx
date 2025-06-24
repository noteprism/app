import { useState, useEffect } from 'react';
import { differenceInDays, format } from 'date-fns';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface TrialBannerProps {
  trialEndsAt: string | null;
  trialEndingSoon: boolean;
  onManageSubscription: () => void;
}

export function TrialBanner({ trialEndsAt, trialEndingSoon, onManageSubscription }: TrialBannerProps) {
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  
  useEffect(() => {
    if (trialEndsAt) {
      const endDate = new Date(trialEndsAt);
      const days = differenceInDays(endDate, new Date());
      setDaysRemaining(Math.max(0, days));
    }
  }, [trialEndsAt]);
  
  if (!trialEndsAt) return null;
  
  // Trial is active
  if (daysRemaining !== null && daysRemaining > 0) {
    return (
      <Alert className={trialEndingSoon ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'}>
        <AlertCircle className={trialEndingSoon ? 'text-amber-500' : 'text-blue-500'} />
        <AlertTitle className="font-medium">
          {trialEndingSoon ? 'Your trial is ending soon!' : 'Trial Active'}
        </AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>
            {trialEndingSoon
              ? `Your trial ends in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}. Add payment info to continue using Noteprism Pro features.`
              : `You have ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} left in your trial (ends ${format(new Date(trialEndsAt), 'MMM d, yyyy')}).`}
          </span>
          <Button 
            variant={trialEndingSoon ? "default" : "outline"} 
            size="sm" 
            onClick={onManageSubscription}
          >
            {trialEndingSoon ? 'Add Payment Method' : 'Manage Subscription'}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  
  // Trial has ended
  return (
    <Alert className="bg-red-50 border-red-200">
      <AlertCircle className="text-red-500" />
      <AlertTitle className="font-medium">Trial Expired</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>Your trial has expired. Subscribe now to continue using Noteprism Pro features.</span>
        <Button variant="default" size="sm" onClick={onManageSubscription}>
          Subscribe Now
        </Button>
      </AlertDescription>
    </Alert>
  );
} 