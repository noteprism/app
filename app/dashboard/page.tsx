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
  
  // More lenient checkout flow - allow any checkout success redirect
  const fromCheckout = searchParams.checkout === 'success' || 
                      searchParams.session_id || 
                      searchParams.verified === 'true' ||
                      searchParams.timeout === 'true' ||
                      searchParams.error === 'true' ||
                      searchParams.manual === 'true';
  
  // If user doesn't have an active plan and we're not in local dev mode, redirect to pricing
  // BUT be very lenient if they're coming from checkout (give webhook/verification time)
  if (!hasActivePlan && !isLocalDev && !fromCheckout) {
    redirect('/pricing');
  }
  
  return <Dashboard />;
} 