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
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
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
  
  // Await searchParams in Next.js 15
  const params = await searchParams;
  
  // Check if local development mode is enabled
  const isLocalDev = process.env.NEXT_PUBLIC_LOCAL_DEV_MODE === 'true';
  
  // Check if user has an active subscription
  const user = session.user;
  const hasActivePlan = userHasActivePlan(user);
  
  // More lenient checkout flow - allow any checkout success redirect
  const fromCheckout = params.checkout === 'success' || 
                      params.session_id || 
                      params.verified === 'true' ||
                      params.timeout === 'true' ||
                      params.error === 'true' ||
                      params.manual === 'true';
  
  // If user doesn't have an active plan and we're not in local dev mode, redirect to pricing
  // BUT be very lenient if they're coming from checkout (give webhook/verification time)
  if (!hasActivePlan && !isLocalDev && !fromCheckout) {
    redirect('/pricing');
  }
  
  return <Dashboard />;
} 