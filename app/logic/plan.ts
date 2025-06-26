export function userHasActivePlan(user: { plan?: string | null, stripeSubscriptionStatus?: string | null }): boolean {
  // User has active plan if they have an active subscription
  return user.plan === 'active' || user.stripeSubscriptionStatus === 'active';
}