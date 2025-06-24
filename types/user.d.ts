export interface User {
  id: string;
  linkedinId?: string | null;
  googleId?: string | null;
  email: string;
  password?: string | null;
  name?: string | null;
  profilePicture?: string | null;
  plan?: string | null; // 'free', 'trial', or 'paid'
  stripeCustomerId?: string | null;
  stripePriceId?: string | null;
  stripeSubscriptionId?: string | null;
  stripeSubscriptionStatus?: string | null;
  subscriptionVerifiedAt?: Date | null;
  trialEndsAt?: Date | null;
  trialEndingSoon: boolean;
} 