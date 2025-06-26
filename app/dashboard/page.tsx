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

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('noteprism_session')?.value;
  
  // If no session, redirect to connect page
  if (!sessionId) {
    redirect('/connect');
  }
  
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });
  
  // If invalid session, redirect to connect page
  if (!session || session.expiresAt <= new Date()) {
    redirect('/connect');
  }
  
  // Check if local development mode is enabled
  const isLocalDev = process.env.NEXT_PUBLIC_LOCAL_DEV_MODE === 'true';
  
  // Check if user has an active subscription
  const user = session.user;
  const hasActivePlan = userHasActivePlan(user);
  
  // If user doesn't have an active plan and we're not in local dev mode, redirect to pricing
  if (!hasActivePlan && !isLocalDev) {
    redirect('/pricing');
  }
  
  // User has active plan, show dashboard
  return <Dashboard />;
} 