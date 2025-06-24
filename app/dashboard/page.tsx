import type { Metadata } from "next"
import { cookies } from 'next/headers';
import { PrismaClient } from '../../lib/generated/prisma';
import Dashboard from "@/components/dashboard"
import { redirect } from 'next/navigation';
import { userHasActiveTrial, userHasActiveSubscription } from "../logic/plan";

const prisma = new PrismaClient();

export const metadata: Metadata = {
  title: "Noteprism - Dashboard",
  description: "Your organized workspace for notes and tasks",
}

export default async function DashboardPage() {
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
  
  // Check if user has an active subscription or is in trial period
  const user = session.user;
  const hasActiveSubscription = userHasActiveSubscription(user);
  const isInTrial = userHasActiveTrial(user);
  
  // If user doesn't have an active subscription or valid trial, redirect to homepage
  if (!hasActiveSubscription && !isInTrial) {
    redirect('/');
  }
  
  return <Dashboard />;
} 