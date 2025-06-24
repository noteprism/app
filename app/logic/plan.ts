export function userHasStandardPlan(user: { plan?: string | null }): boolean {
  return user.plan === 'paid';
}

export function userHasActiveSubscription(user: { stripeSubscriptionStatus?: string | null }): boolean {
  return user.stripeSubscriptionStatus === 'active';
}

export function userHasActiveTrial(user: { trialEndsAt?: Date | string | null }): boolean {
  if (!user.trialEndsAt) return false;
  const trialEndDate = new Date(user.trialEndsAt);
  const now = new Date();
  return trialEndDate > now;
}

export function calculateTrialDaysRemaining(trialEndsAt: Date | string | null): number {
  if (!trialEndsAt) return 0;
  const endDate = new Date(trialEndsAt);
  const now = new Date();
  const days = Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, days);
}

// Trial period in days
export const TRIAL_PERIOD_DAYS = 7; 