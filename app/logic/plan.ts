export function userHasStandardPlan(user: { plan?: string | null }): boolean {
  return user.plan === 'standard';
} 