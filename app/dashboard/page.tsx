import type { Metadata } from "next"
import { cookies } from 'next/headers';
import { PrismaClient } from '../../lib/generated/prisma';
import Dashboard from "@/components/dashboard"
import { redirect } from 'next/navigation';
import { userHasActivePlan } from "../logic/plan";

const prisma = new PrismaClient();

export const metadata: Metadata = {
  title: "Noteprism - Dashboard",
  description: "Your organized workspace for notes and tasks",
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('noteprism_session')?.value;
  
  if (!sessionId) {
    redirect('/');
  }
  
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });
  
  if (!session || session.expiresAt <= new Date()) {
    redirect('/');
  }
  
  // Check if local development mode is enabled
  const isLocalDev = process.env.NEXT_PUBLIC_LOCAL_DEV_MODE === 'true';
  
  // Check if user has an active subscription
  const user = session.user;
  const hasActivePlan = userHasActivePlan(user);
  
  // Check if we're coming from a successful payment flow
  const isPostPayment = searchParams.subscription === 'active';
  
  // If user doesn't have an active plan and we're not in local dev mode or post-payment flow, redirect to homepage
  if (!hasActivePlan && !isLocalDev && !isPostPayment) {
    // If we just completed payment but the database hasn't updated yet, force a sync
    if (isPostPayment) {
      // This is a fallback - the success handler should have already updated the user
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/stripe/sync`, {
        method: 'GET',
        headers: {
          Cookie: `noteprism_session=${sessionId}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.plan === 'active') {
          // User is now active, continue to dashboard
          return <Dashboard showSubscriptionSuccess={true} />;
        }
      }
    }
    
    redirect('/');
  }
  
  return <Dashboard showSubscriptionSuccess={isPostPayment} />;
} 