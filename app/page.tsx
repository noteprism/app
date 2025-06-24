import type { Metadata } from "next"
import { cookies } from 'next/headers';
import { PrismaClient } from '../lib/generated/prisma';
import PricingTable from "@/components/PricingTable";
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export const metadata: Metadata = {
  title: "Noteprism - Your Organized Workspace",
  description: "A fusion of Notion and TickTick for organizing your notes and tasks",
}

export default async function Home({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('noteprism_session')?.value;
  let isLoggedIn = false;
  
  // Check for checkout success or cancel parameters
  const checkout = searchParams?.checkout;
  const isCheckoutSuccess = checkout === 'success';
  const isCheckoutCancel = checkout === 'cancel';
  const startTrialIntent = searchParams?.start_trial === '1';
  
  if (sessionId) {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });
    
    if (session && session.expiresAt > new Date()) {
      isLoggedIn = true;
      
      // If user has just logged in and wants to start a trial, redirect to checkout
      if (startTrialIntent) {
        redirect('/api/stripe/checkout');
      }
      
      // If user canceled checkout, they should stay on the pricing page
      if (isCheckoutCancel) {
        // Return pricing page even if logged in
        return <PricingTable />;
      }
      
      // Check if user has an active subscription or is in trial period
      const user = session.user;
      const hasActiveSubscription = user.stripeSubscriptionStatus === 'active';
      const isInTrial = user.trialEndsAt && new Date(user.trialEndsAt) > new Date();
      
      // If user has active subscription or valid trial, redirect to dashboard
      if (hasActiveSubscription || isInTrial) {
        redirect('/dashboard');
      }
    }
  }

  // For non-logged in users or those without active subscription/trial
  return <PricingTable />;
}
