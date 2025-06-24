import type { Metadata } from "next"
import { cookies } from 'next/headers';
import { PrismaClient } from '../lib/generated/prisma';
import PricingTable from "@/components/PricingTable";
import { redirect } from 'next/navigation';
import { userHasActiveTrial, userHasActiveSubscription } from "./logic/plan";

const prisma = new PrismaClient();

export const metadata: Metadata = {
  title: "Noteprism - Your Organized Workspace",
  description: "A fusion of Notion and TickTick for organizing your notes and tasks",
}

export default async function Home({ 
  searchParams 
}: { 
  searchParams: { [key: string]: string | undefined } 
}) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('noteprism_session')?.value;
  let isLoggedIn = false;
  
  if (sessionId) {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });
    
    if (session && session.expiresAt > new Date()) {
      isLoggedIn = true;
      
      // Check if user has an active subscription or is in trial period
      const user = session.user;
      const hasActiveSubscription = userHasActiveSubscription(user);
      const isInTrial = userHasActiveTrial(user);
      
      // If user has active subscription or valid trial, redirect to dashboard
      if (hasActiveSubscription || isInTrial || user.plan === 'trial') {
        redirect('/dashboard');
      }
    }
  }

  // For non-logged in users or those without active subscription/trial
  return <PricingTable />;
}
